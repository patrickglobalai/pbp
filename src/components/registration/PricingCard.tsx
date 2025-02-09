import React from 'react';
import { DollarSign, Star } from 'lucide-react';

export function PricingCard() {
  return (
    <div className="glass-effect rounded-3xl p-8 text-center">
      <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-yellow-300 mb-6">
        <Star className="w-4 h-4" />
        <span>Limited Time Offer</span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">Special Launch Price</h3>
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-5xl font-bold text-white">$97</span>
        <div className="text-left">
          <div className="text-white/60 line-through">Regular $497</div>
          <div className="text-emerald-400">Save $400</div>
        </div>
      </div>
      <p className="text-white/80 mb-6">
        One-time payment for the complete certification program
      </p>
      <div className="space-y-4 text-left mb-8">
        <div className="flex items-center gap-2 text-white/90">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>Money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-white/90">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>Lifetime certification</span>
        </div>
      </div>
    </div>
  );
}