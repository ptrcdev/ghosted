import { useEffect, useState } from "react";
import useAxiosAuth from "../../../hooks/useAxiosAuth"
import { useToast } from "../../ui/use-toast";

export const Stats = () => {
    const axiosAuth = useAxiosAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState<{ label: string, value: number, color: string }[]>([]);

    useEffect(() => {
        const getStats = async () => {
            try {
                const response = await axiosAuth.get('/stats');

                if (response.status === 200) {
                    setStats(response.data)
                } else {
                    toast({
                        title: "Error fetching stats.",
                        description: "Please try again.",
                        variant: "destructive",
                    });
                    return;
                }
            } catch (error) {
                toast({
                    title: "Error fetching stats.",
                    description: "Please try again.",
                    variant: "destructive",
                });
                return;
            }
        }

        getStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Overview</h2>
        <div className="grid grid-cols-6 gap-6 mb-6">
            {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center bg-secondary/60 rounded-lg p-4">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
        </div>

    )
}