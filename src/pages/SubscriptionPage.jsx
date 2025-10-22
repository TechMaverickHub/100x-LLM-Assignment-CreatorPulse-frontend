import { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      credits: '100 credits',
      description: 'Perfect for getting started',
      features: [
        '100 newsletter credits',
        'Basic AI newsletter generation',
        'Email delivery',
        'Basic topic selection',
        'Standard support'
      ],
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '₹799',
      period: 'per month',
      credits: '1,000 credits',
      description: 'For regular newsletter creators',
      features: [
        '1,000 newsletter credits',
        'Advanced AI newsletter generation',
        'Priority email delivery',
        'Advanced topic selection',
        'Custom templates',
        'Priority support',
        'Analytics dashboard'
      ],
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹1,599',
      period: 'per month',
      credits: 'Unlimited credits',
      description: 'For power users and businesses',
      features: [
        'Unlimited newsletter credits',
        'Premium AI newsletter generation',
        'Instant email delivery',
        'Advanced topic selection',
        'Custom templates & branding',
        '24/7 priority support',
        'Advanced analytics',
        'API access',
        'White-label options'
      ],
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = (planId) => {
    // This would integrate with payment processing
    console.log(`Upgrading to ${planId} plan`);
    // For now, just show an alert
    alert(`Upgrade to ${plans.find(p => p.id === planId)?.name} plan - Payment integration coming soon!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-2 text-lg text-gray-600">
          Select the perfect plan for your newsletter needs
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <p className="text-sm text-gray-600">
              You're currently on the <span className="font-medium text-primary-600">Free</span> plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Credits remaining</p>
            <p className="text-2xl font-bold text-primary-600">100</p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const isCurrentPlan = plan.id === 'free'; // Assuming user is on free plan by default

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-primary-500 shadow-lg scale-105' 
                  : plan.borderColor
              } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{plan.credits}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <div className="mt-6">
                  {isCurrentPlan ? (
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Current Plan
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-colors ${plan.buttonColor}`}
                    >
                      {plan.id === 'free' ? 'Downgrade' : 'Upgrade to ' + plan.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Free Plan</h4>
            <p className="text-gray-600">
              Perfect for trying out our service. Includes 100 credits to generate newsletters.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Standard Plan</h4>
            <p className="text-gray-600">
              Great for regular users who need more credits and advanced features.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Premium Plan</h4>
            <p className="text-gray-600">
              Best for power users and businesses with unlimited credits and premium features.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">What are credits?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Credits are used to generate newsletters. Each newsletter generation consumes one credit.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Can I change my plan anytime?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What happens to unused credits?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Unused credits roll over to the next month for Standard and Premium plans. Free plan credits reset monthly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
