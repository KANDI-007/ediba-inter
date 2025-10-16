import React from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users,
  Bell,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  currentDate?: string;
  greeting?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Utilisateur',
  currentDate,
  greeting
}) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Bonjour';
    if (currentHour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getTimeOfDay = () => {
    if (currentHour < 12) return 'matin';
    if (currentHour < 18) return 'après-midi';
    return 'soir';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeIcon = () => {
    if (currentHour < 12) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (currentHour < 18) return <Sun className="w-5 h-5 text-orange-500" />;
    return <Moon className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
      
      {/* Content */}
      <div className="relative px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Greeting */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  {getTimeIcon()}
                  <h1 className="text-4xl font-bold text-white">
                    {greeting || getGreeting()}, {userName} !
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  Bienvenue sur votre tableau de bord EDIBA-INTER
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {currentDate || formatDate(now)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {now.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium text-white">
                    Système opérationnel
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Users className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-medium text-white">
                    Équipe connectée
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Stats Preview */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">+12%</span>
                  </div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Croissance</h3>
                  <p className="text-xs text-blue-200">Ce mois-ci</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">24</span>
                  </div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Clients actifs</h3>
                  <p className="text-xs text-blue-200">Cette semaine</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Notifications</h3>
                  <p className="text-xs text-blue-200">Non lues</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">98%</span>
                  </div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Performance</h3>
                  <p className="text-xs text-blue-200">Système</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default DashboardHeader;
