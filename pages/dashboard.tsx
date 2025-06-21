import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import AppLayout from '../components/layout/AppLayout'
import MetaBoxCard from '../components/MetaBoxCard'

export default function Dashboard() {
  const metaBoxes = [
    {
      id: "hiring",
      icon: "👥",
      title: "Hiring",
      description: "AI-powered candidate sourcing and screening",
      color: "bg-blue-500",
      stats: { active: 12, completed: 8 }
    },
    {
      id: "selling",
      icon: "🛍️",
      title: "Selling",
      description: "Lead qualification and sales automation",
      color: "bg-green-500",
      stats: { active: 24, completed: 15 }
    },
    {
      id: "fundraising",
      icon: "💰",
      title: "Fundraising",
      description: "Investor pipeline and deal tracking",
      color: "bg-purple-500",
      stats: { active: 8, completed: 3 }
    },
    {
      id: "product",
      icon: "🚀",
      title: "Product",
      description: "Feature prioritization and roadmap",
      color: "bg-orange-500",
      stats: { active: 18, completed: 12 }
    },
    {
      id: "marketing",
      icon: "📢",
      title: "Marketing",
      description: "Campaign orchestration and analytics",
      color: "bg-pink-500",
      stats: { active: 6, completed: 4 }
    },
    {
      id: "operations",
      icon: "⚙️",
      title: "Operations",
      description: "Process automation and optimization",
      color: "bg-gray-500",
      stats: { active: 10, completed: 7 }
    }
  ];

  return (
    <>
      <Head>
        <title>Activities - Command Center</title>
        <meta name="description" content="Manage your business operations with AI-powered tools" />
      </Head>
      <AppLayout>
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
              <p className="text-base text-gray-600">Manage your business operations with AI-powered tools</p>
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Create new meta box"
            >
              Create Meta Box
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {metaBoxes.map((metaBox) => (
                <MetaBoxCard
                  key={metaBox.id}
                  id={metaBox.id}
                  icon={metaBox.icon}
                  title={metaBox.title}
                  description={metaBox.description}
                  color={metaBox.color}
                  stats={metaBox.stats}
                  href={`/${metaBox.id}`}
                />
              ))}
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
} 