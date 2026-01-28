// supabase/functions/ghosted-nudges/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_ORIGIN = Deno.env.get("APP_ORIGIN") || "http://localhost:5173";
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}
if (!RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false
  }
});
function daysAgoISO(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}
// Super simple HTML email (MVP). Keep it readable.
function buildEmailHtml(apps) {
  const items = apps.map((a)=>`<li><strong>${escapeHtml(a.company)}</strong> — ${escapeHtml(a.job_title)} <span style="color:#666">(status: ${escapeHtml(a.status)})</span></li>`).join("");
  const link = `${APP_ORIGIN}/dashboard`;
  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; line-height: 1.5;">
    <h2>Still waiting on some applications?</h2>
    <p>It’s been over a week since you last updated these:</p>
    <ul>${items}</ul>
    <p style="margin-top:16px;">
      <a href="${link}" style="display:inline-block;padding:10px 14px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;">
        Review in Ghosted
      </a>
    </p>
    <p style="color:#666;font-size:12px;margin-top:18px;">
      You’re receiving this because you have job applications tracked in Ghosted.
    </p>
  </div>
  `;
}
function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
async function sendEmailResend(to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Ghosted <no-reply@ghosted.ptrclmd.dev>",
      to: [
        to
      ],
      subject,
      html
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
  return await res.json();
}
/**
 * Finds stale applications (status_updated_at older than 7 days),
 * sends one email per user, then updates last_nudge_sent_at.
 */ async function runNudges() {
  const cutoff = daysAgoISO(7);
  const nudgeCooldown = daysAgoISO(7);
  const { data: apps, error } = await supabaseAdmin.from("applications").select("id,user_id,company,job_title,status,created_at,status_updated_at,last_nudge_sent_at").in("status", [
    "applied",
    "screening",
    "interviewing"
  ]) // don't nudge 'ghosted' or 'rejected' usually
  // stale condition:
  // status_updated_at <= cutoff OR (status_updated_at IS NULL AND created_at <= cutoff)
  .or([
    `status_updated_at.lte.${cutoff}`,
    `and(status_updated_at.is.null,created_at.lte.${cutoff})`
  ].join(","))// cooldown condition:
  // last_nudge_sent_at IS NULL OR last_nudge_sent_at <= nudgeCooldown
  .or([
    `last_nudge_sent_at.is.null`,
    `last_nudge_sent_at.lte.${nudgeCooldown}`
  ].join(",")).order("created_at", {
    ascending: true
  });
  if (error) throw new Error(`DB query error: ${error.message}`);
  if (!apps || apps.length === 0) {
    return {
      emailedUsers: 0,
      updatedApps: 0,
      reason: "no_candidates"
    };
  }
  const byUser = new Map();
  for (const a of apps){
    const arr = byUser.get(a.user_id) ?? [];
    arr.push(a);
    byUser.set(a.user_id, arr);
  }
  const userIds = Array.from(byUser.keys());
  const emailsByUserId = new Map();
  for (const uid of userIds){
    const { data, error: uErr } = await supabaseAdmin.auth.admin.getUserById(uid);
    if (uErr) {
      console.warn("Could not load user", uid, uErr.message);
      continue;
    }
    const email = data.user?.email;
    if (email) emailsByUserId.set(uid, email);
  }
  let emailedUsers = 0;
  const appIdsToUpdate = [];
  for (const [uid, userApps] of byUser.entries()){
    const email = emailsByUserId.get(uid);
    if (!email) continue;
    const subject = `Ghosted: still waiting on ${userApps.length} application${userApps.length === 1 ? "" : "s"}?`;
    const html = buildEmailHtml(userApps);
    await sendEmailResend(email, subject, html);
    emailedUsers += 1;
    for (const a of userApps)appIdsToUpdate.push(a.id);
  }
  let updatedApps = 0;
  if (appIdsToUpdate.length > 0) {
    const { error: upErr, count } = await supabaseAdmin.from("applications").update({
      last_nudge_sent_at: new Date().toISOString()
    }).in("id", appIdsToUpdate).select("id", {
      count: "exact",
      head: true
    });
    if (upErr) throw new Error(`DB update error: ${upErr.message}`);
    updatedApps = count ?? appIdsToUpdate.length;
  }
  return {
    emailedUsers,
    updatedApps
  };
}
// Optional: protect the function so random people can’t trigger it.
// For cron you can call it without auth but include a shared secret header.
// For MVP, leave it open ONLY if cron is internal + function URL not publicized.
serve(async (req)=>{
  try {
    if (req.method !== "POST") {
      return new Response("Use POST", {
        status: 405
      });
    }
    const result = await runNudges();
    return new Response(JSON.stringify({
      ok: true,
      result
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({
      ok: false,
      error: String(e)
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
