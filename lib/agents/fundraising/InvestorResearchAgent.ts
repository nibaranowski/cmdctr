import { Agent, AgentCreateInput } from '../../../models/Agent';
import { CoreObject } from '../../../models/CoreObject';
import { BaseAgent, AgentContext, AgentResult } from '../BaseAgent';

export interface InvestorResearchAgentConfig {
  data_sources: string[];
  research_depth: 'basic' | 'comprehensive' | 'deep';
  output_format: 'summary' | 'detailed' | 'structured';
  include_network_analysis: boolean;
  include_financial_analysis: boolean;
}

/**
 * InvestorResearchAgent
 * 
 * Purpose: Identifies and researches potential investors that match company criteria
 * Phase: Identifying investors
 * Meta Box: Fundraising
 * 
 * Input:
 * - Company profile
 * - Investment criteria (stage, size, industry)
 * - Target geography
 * 
 * Output:
 * - List of potential investors
 * - Investment thesis match
 * - Portfolio analysis
 * - Potential conflicts
 */
export class InvestorResearchAgent extends BaseAgent {
  private config: InvestorResearchAgentConfig;

  constructor(agentData: AgentCreateInput, config?: Partial<InvestorResearchAgentConfig>) {
    super({
      ...agentData,
      name: agentData.name || 'Investor Research Agent',
      description: agentData.description || 'AI agent specialized in investor research and analysis',
      agent_type: 'ai',
      capabilities: [
        'investor_research',
        'network_analysis', 
        'financial_analysis',
        'deal_flow_analysis',
        'market_research',
        'competitor_analysis'
      ],
      skills: [
        {
          name: 'Investor Research',
          level: 'expert',
          description: 'Deep research on investors, their portfolio, and investment thesis'
        },
        {
          name: 'Network Analysis',
          level: 'advanced',
          description: 'Mapping investor networks and connections'
        },
        {
          name: 'Financial Analysis',
          level: 'advanced',
          description: 'Analyzing investor financials and deal patterns'
        }
      ]
    });

    this.config = {
      data_sources: ['crunchbase', 'pitchbook', 'linkedin', 'twitter', 'news'],
      research_depth: 'comprehensive',
      output_format: 'structured',
      include_network_analysis: true,
      include_financial_analysis: true,
      ...config
    };
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const { core_object_id, metadata } = context;
      
      if (!core_object_id) {
        return this.handleError(new Error('Core object ID is required for investor research'));
      }

      const investorName = metadata?.investor_name;
      if (!investorName) {
        return this.handleError(new Error('Investor name is required in metadata'));
      }

      const researchResult = await this.researchInvestor(investorName, context.company_id);
      
      if (core_object_id) {
        await this.updateCoreObject(core_object_id, researchResult);
      }

      return this.createResult(researchResult, {
        investor_name: investorName,
        research_depth: this.config.research_depth,
        core_object_id
      });
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  async researchInvestor(investorName: string, companyId: string): Promise<{
    investor_profile: any;
    investment_thesis: string;
    portfolio_analysis: any;
    network_connections: any[];
    deal_flow_patterns: any;
    recommendations: string[];
  }> {
    try {
      this.updateStatus('busy');
      
      // Simulate AI-powered research
      const researchResult = await this.performResearch(investorName);
      
      // Log activity
      await this.logActivity({
        type: 'investor_research',
        message: `Completed research on ${investorName}`,
        data: { investor_name: investorName, research_depth: this.config.research_depth }
      });

      this.updateStatus('active');
      return researchResult;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to research investor ${investorName}: ${error}`);
    }
  }

  async analyzePortfolio(portfolioCompanies: string[]): Promise<{
    sector_distribution: any;
    stage_distribution: any;
    geographic_distribution: any;
    investment_patterns: any;
    insights: string[];
  }> {
    try {
      this.updateStatus('busy');
      
      const analysis = await this.performPortfolioAnalysis(portfolioCompanies);
      
      await this.logActivity({
        type: 'portfolio_analysis',
        message: `Analyzed portfolio of ${portfolioCompanies.length} companies`,
        data: { company_count: portfolioCompanies.length }
      });

      this.updateStatus('active');
      return analysis;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to analyze portfolio: ${error}`);
    }
  }

  async generateInvestorList(criteria: {
    sector?: string;
    stage?: string;
    geography?: string;
    investment_size?: string;
    thesis_alignment?: string;
  }): Promise<{
    investors: any[];
    reasoning: string;
    priority_scores: any;
    next_steps: string[];
  }> {
    try {
      this.updateStatus('busy');
      
      const investorList = await this.performInvestorDiscovery(criteria);
      
      await this.logActivity({
        type: 'investor_discovery',
        message: `Generated investor list based on criteria: ${JSON.stringify(criteria)}`,
        data: { criteria, investor_count: investorList.investors.length }
      });

      this.updateStatus('active');
      return investorList;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to generate investor list: ${error}`);
    }
  }

  async updateCoreObject(coreObjectId: string, researchData: any): Promise<void> {
    try {
      // Update the core object with research findings
      const updateData = {
        data: {
          ...researchData,
          last_researched: new Date().toISOString(),
          research_agent: this.id
        }
      };

      // This would typically call the API to update the core object
      console.log(`Updating core object ${coreObjectId} with research data`);
      
      await this.logActivity({
        type: 'core_object_update',
        message: `Updated core object ${coreObjectId} with research findings`,
        data: { core_object_id: coreObjectId }
      });
    } catch (error) {
      throw new Error(`Failed to update core object: ${error}`);
    }
  }

  private async performResearch(investorName: string): Promise<any> {
    // Simulate AI research process
    await this.simulateWork(2000); // 2 seconds
    
    return {
      investor_profile: {
        name: investorName,
        firm: 'Example Capital',
        focus_areas: ['SaaS', 'FinTech', 'AI/ML'],
        investment_stages: ['Series A', 'Series B'],
        avg_check_size: '$5M-$15M',
        portfolio_size: 45,
        founded: 2010
      },
      investment_thesis: `${investorName} focuses on B2B SaaS companies with strong unit economics and clear path to profitability. They prefer companies with $1M+ ARR and 100%+ growth rates.`,
      portfolio_analysis: {
        total_investments: 45,
        successful_exits: 12,
        avg_roi: '3.2x',
        sector_breakdown: {
          'SaaS': 60,
          'FinTech': 25,
          'AI/ML': 15
        }
      },
      network_connections: [
        { name: 'John Smith', role: 'Partner', connection_strength: 'strong' },
        { name: 'Jane Doe', role: 'Principal', connection_strength: 'medium' }
      ],
      deal_flow_patterns: {
        avg_deal_flow: '50/month',
        conversion_rate: '2%',
        avg_time_to_close: '3 months'
      },
      recommendations: [
        'Focus on unit economics in pitch deck',
        'Highlight B2B SaaS metrics',
        'Prepare for technical due diligence',
        'Network with portfolio companies'
      ]
    };
  }

  private async performPortfolioAnalysis(companies: string[]): Promise<any> {
    await this.simulateWork(1500);
    
    return {
      sector_distribution: {
        'SaaS': 60,
        'FinTech': 25,
        'AI/ML': 15
      },
      stage_distribution: {
        'Seed': 20,
        'Series A': 40,
        'Series B': 30,
        'Series C+': 10
      },
      geographic_distribution: {
        'US West Coast': 50,
        'US East Coast': 30,
        'Europe': 15,
        'Other': 5
      },
      investment_patterns: {
        avg_check_size: '$8M',
        follow_on_rate: 70,
        board_seat_rate: 40
      },
      insights: [
        'Strong preference for B2B SaaS companies',
        'High follow-on investment rate',
        'Active board participation',
        'Geographic concentration in tech hubs'
      ]
    };
  }

  private async performInvestorDiscovery(criteria: any): Promise<any> {
    await this.simulateWork(3000);
    
    return {
      investors: [
        {
          name: 'Sequoia Capital',
          match_score: 95,
          reasoning: 'Perfect alignment with B2B SaaS focus and investment stage',
          contact_info: { email: 'partners@sequoia.com', linkedin: 'linkedin.com/company/sequoia' }
        },
        {
          name: 'Andreessen Horowitz',
          match_score: 88,
          reasoning: 'Strong AI/ML focus and similar investment thesis',
          contact_info: { email: 'partners@a16z.com', linkedin: 'linkedin.com/company/a16z' }
        }
      ],
      reasoning: `Based on criteria: ${JSON.stringify(criteria)}. Focused on investors with proven track record in target sector and stage.`,
      priority_scores: {
        'Sequoia Capital': 95,
        'Andreessen Horowitz': 88
      },
      next_steps: [
        'Prepare customized pitch deck',
        'Research recent investments',
        'Identify warm introduction paths',
        'Prepare financial projections'
      ]
    };
  }

  private async simulateWork(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
} 