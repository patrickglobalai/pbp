import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function EventDetails() {
  return (
    <div className="glass-effect rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Event Details</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Calendar className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-white font-medium">January 29th - 31st, 2025</div>
            <div className="text-white/70">3 full days of intensive training</div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Clock className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-white font-medium">10 AM to 3 PM EST daily</div>
            <div className="text-white/70">5 hours of live training each day</div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-white font-medium">Online Virtual Training</div>
            <div className="text-white/70">Join from anywhere in the world</div>
          </div>
        </div>
      </div>
    </div>
  );
}