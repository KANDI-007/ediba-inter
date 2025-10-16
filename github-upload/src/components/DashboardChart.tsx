import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

interface DashboardChartProps {
  title: string;
  type?: 'line' | 'bar' | 'doughnut';
  data: any;
  className?: string;
  showTrend?: boolean;
  trendValue?: number;
  trendPeriod?: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  type = 'line',
  data,
  className = '',
  showTrend = true,
  trendValue = 0,
  trendPeriod = 'vs mois dernier'
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

        // Configuration des couleurs
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
            labels: data.labels || [],
            datasets: data.datasets?.map((dataset: any, index: number) => ({
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
            })) || []
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
                    return `${context.dataset.label}: ${Number(value).toLocaleString('fr-FR')} FCFA`;
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
                    return `${Number(value).toLocaleString('fr-FR')}`;
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
  }, [data, type]);

  const getTrendIcon = () => {
    if (trendValue > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trendValue < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <BarChart3 className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (trendValue > 0) return 'text-green-600';
    if (trendValue < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {type === 'doughnut' ? (
                <PieChart className="w-5 h-5 text-blue-600" />
              ) : (
                <BarChart3 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          {showTrend && (
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              trendValue > 0 ? 'bg-green-100 text-green-700' : 
              trendValue < 0 ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {getTrendIcon()}
              <span>
                {trendValue > 0 ? '+' : ''}{trendValue}% {trendPeriod}
              </span>
            </div>
          )}
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

export default DashboardChart;
