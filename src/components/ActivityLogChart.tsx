import React, { useEffect, useRef, useState } from 'react';
import { ActivityLog } from '../contexts/ActivityContext';
import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react';

interface ActivityLogChartProps {
  activities: ActivityLog[];
  type?: 'line' | 'bar' | 'doughnut';
  period?: 'hour' | 'day' | 'week' | 'month';
  className?: string;
}

const ActivityLogChart: React.FC<ActivityLogChartProps> = ({
  activities,
  type = 'bar',
  period = 'day',
  className = ''
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      try {
        setIsLoading(true);
        const Chart = (await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm')).default;
        
        if (!chartRef.current) return;
        
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        // Préparer les données selon la période
        const data = prepareChartData(activities, period);
        
        const colors = {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#06B6D4'
        };

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        const chartConfig = {
          type,
          data: {
            labels: data.labels,
            datasets: data.datasets.map((dataset: any, index: number) => ({
              ...dataset,
              backgroundColor: type === 'doughnut' 
                ? [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger, colors.info]
                : gradient,
              borderColor: type === 'doughnut' 
                ? [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger, colors.info]
                : colors.primary,
              borderWidth: 2,
              tension: 0.4,
              fill: type !== 'doughnut',
              pointBackgroundColor: colors.primary,
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: type === 'doughnut',
                position: 'bottom' as const,
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12,
                    family: 'Inter, sans-serif'
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: colors.primary,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: function(context: any) {
                    const value = context.parsed.y || context.parsed;
                    return `${context.dataset.label}: ${value} activité${value > 1 ? 's' : ''}`;
                  }
                }
              }
            },
            scales: type !== 'doughnut' ? {
              x: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 11,
                    family: 'Inter, sans-serif'
                  }
                }
              },
              y: {
                grid: {
                  color: 'rgba(107, 114, 128, 0.1)',
                  drawBorder: false
                },
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 11,
                    family: 'Inter, sans-serif'
                  },
                  callback: function(value: any) {
                    return Number(value).toFixed(0);
                  }
                }
              }
            } : {},
            interaction: {
              intersect: false,
              mode: 'index' as const
            },
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart' as const
            }
          }
        };

        new Chart(ctx, chartConfig);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du graphique:', error);
        setIsLoading(false);
      }
    };

    loadChart();
  }, [activities, type, period]);

  const prepareChartData = (activities: ActivityLog[], period: string) => {
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    switch (period) {
      case 'hour':
        // 24 dernières heures
        labels = Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
          return hour.getHours().toString().padStart(2, '0') + 'h';
        });
        data = Array.from({ length: 24 }, (_, i) => {
          const hourStart = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
          const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
          return activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= hourStart && activityDate < hourEnd;
          }).length;
        });
        break;

      case 'day':
        // 7 derniers jours
        labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' });
        });
        data = Array.from({ length: 7 }, (_, i) => {
          const dayStart = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
          return activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= dayStart && activityDate < dayEnd;
          }).length;
        });
        break;

      case 'week':
        // 4 dernières semaines
        labels = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(now.getTime() - (3 - i) * 7 * 24 * 60 * 60 * 1000);
          return `S${weekStart.getWeek()}`;
        });
        data = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(now.getTime() - (3 - i) * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          return activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= weekStart && activityDate < weekEnd;
          }).length;
        });
        break;

      case 'month':
        // 12 derniers mois
        labels = Array.from({ length: 12 }, (_, i) => {
          const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
          return month.toLocaleDateString('fr-FR', { month: 'short' });
        });
        data = Array.from({ length: 12 }, (_, i) => {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
          return activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            return activityDate >= monthStart && activityDate < monthEnd;
          }).length;
        });
        break;

      default:
        labels = ['Aujourd\'hui'];
        data = [activities.length];
    }

    return {
      labels,
      datasets: [{
        label: `Activités par ${period}`,
        data
      }]
    };
  };

  const getChartTitle = () => {
    switch (period) {
      case 'hour': return 'Activités par heure';
      case 'day': return 'Activités par jour';
      case 'week': return 'Activités par semaine';
      case 'month': return 'Activités par mois';
      default: return 'Activités';
    }
  };

  const getChartIcon = () => {
    switch (type) {
      case 'line': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'bar': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'doughnut': return <Activity className="w-5 h-5 text-blue-600" />;
      default: return <BarChart3 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {getChartIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getChartTitle()}</h3>
            <p className="text-sm text-gray-500">Évolution des activités dans le temps</p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Chargement du graphique...</p>
            </div>
          </div>
        ) : (
          <div className="relative h-64">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

// Extension pour getWeek si elle n'existe pas
declare global {
  interface Date {
    getWeek(): number;
  }
}

if (!Date.prototype.getWeek) {
  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    const today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    const dayOfYear = ((today.getTime() - onejan.getTime() + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
  };
}

export default ActivityLogChart;
