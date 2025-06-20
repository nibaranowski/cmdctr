import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Homepage() {
  const features = [
    {
      icon: "👥",
      title: "Hiring",
      description: "AI-powered candidate sourcing, screening, and interview coordination"
    },
    {
      icon: "💰",
      title: "Fundraising",
      description: "Investor pipeline management, due diligence automation, and deal tracking"
    },
    {
      icon: "🛍️",
      title: "Selling",
      description: "Lead qualification, proposal generation, and sales process automation"
    },
    {
      icon: "🚀",
      title: "Product",
      description: "Feature prioritization, user feedback analysis, and roadmap planning"
    },
    {
      icon: "📢",
      title: "Marketing",
      description: "Campaign orchestration, content generation, and performance tracking"
    },
    {
      icon: "⚙️",
      title: "Operations",
      description: "Process automation, workflow optimization, and team coordination"
    }
  ];

  const integrations = [
    { name: "Slack", logo: "💬" },
    { name: "GitHub", logo: "🐙" },
    { name: "Notion", logo: "📝" },
    { name: "Stripe", logo: "💳" },
    { name: "HubSpot", logo: "🎯" },
    { name: "Salesforce", logo: "☁️" },
    { name: "Zapier", logo: "🔗" },
    { name: "Figma", logo: "🎨" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Command Center - The Command Center for Modern Business</title>
        <meta name="description" content="Manage hiring, fundraising, product, marketing & ops — all in one place, powered by AI agents." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">Command Center</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link href="#integrations" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Integrations
                </Link>
                <Link href="#pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Log in
              </Link>
              <Link href="/dashboard" className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Command Center for
            <span className="text-blue-600"> Modern Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage hiring, fundraising, product, marketing & ops — all in one place, powered by AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started Free
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to scale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered workspaces for every aspect of your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Works with your favorite tools
            </h2>
            <p className="text-xl text-gray-600">
              Seamlessly integrate with your existing workflow
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {integrations.map((integration, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-3xl mb-2">{integration.logo}</div>
                <span className="text-sm text-gray-600 font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies using Command Center to scale efficiently
          </p>
          <Link href="/dashboard" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Command Center</h3>
              <p className="text-gray-400">
                The command center for modern business operations.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Integrations</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Command Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 