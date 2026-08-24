import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PROJECTS } from '../constants';

export const TechStackChart: React.FC = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const techFrequency: Record<string, number> = {};
    PROJECTS.forEach(project => {
        project.technologies?.forEach(tech => {
            techFrequency[tech] = (techFrequency[tech] || 0) + 1;
        });
    });

    const data = Object.entries(techFrequency)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="w-full h-80 flex flex-col bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-12">
            <h4 className="text-lg font-black text-slate-950 dark:text-white mb-6 uppercase tracking-widest text-sm">Technology Stack Distribution</h4>
            <div className="w-full flex-1 min-w-0 min-h-0">
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#2563eb', '#1e3a8a'][index % 3]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
