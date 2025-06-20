import { Agent, AgentCreateInput } from '../../../models/Agent';
import { BaseAgent, AgentContext, AgentResult } from '../BaseAgent';

export interface AIOutreachAgentConfig {
  outreach_channels: string[];
  personalization_level: 'basic' | 'moderate' | 'high';
  follow_up_strategy: 'none' | 'single' | 'multi';
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  include_tracking: boolean;
  max_daily_outreach: number;
}

export interface OutreachMessage {
  recipient: string;
  channel: string;
  subject?: string;
  content: string;
  personalization_data: Record<string, any>;
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
}

export class AIOutreachAgent extends BaseAgent {
  private config: AIOutreachAgentConfig;

  constructor(agentData: AgentCreateInput, config?: Partial<AIOutreachAgentConfig>) {
    super({
      ...agentData,
      name: agentData.name || 'AI Outreach Agent',
      description: agentData.description || 'AI agent specialized in personalized investor outreach and communication',
      agent_type: 'ai',
      capabilities: [
        'personalized_outreach',
        'email_automation',
        'linkedin_messaging',
        'follow_up_sequences',
        'response_handling',
        'engagement_tracking'
      ],
      skills: [
        {
          name: 'Personalized Communication',
          level: 'expert',
          description: 'Creating highly personalized outreach messages based on investor research'
        },
        {
          name: 'Multi-Channel Outreach',
          level: 'advanced',
          description: 'Coordinating outreach across email, LinkedIn, and other channels'
        },
        {
          name: 'Follow-up Sequences',
          level: 'advanced',
          description: 'Designing and executing effective follow-up sequences'
        }
      ]
    });

    this.config = {
      outreach_channels: ['email', 'linkedin'],
      personalization_level: 'high',
      follow_up_strategy: 'multi',
      tone: 'professional',
      include_tracking: true,
      max_daily_outreach: 50,
      ...config
    };
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const { core_object_id, metadata } = context;
      
      if (!core_object_id) {
        return this.handleError(new Error('Core object ID is required for outreach'));
      }

      const investorData = metadata?.investor_data;
      if (!investorData) {
        return this.handleError(new Error('Investor data is required in metadata'));
      }

      const outreachResult = await this.createPersonalizedOutreach(investorData, context.company_id);
      
      if (core_object_id) {
        await this.updateCoreObject(core_object_id, outreachResult);
      }

      return this.createResult(outreachResult, {
        investor_name: investorData.name,
        outreach_channels: this.config.outreach_channels,
        core_object_id
      });
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  async createPersonalizedOutreach(investorData: any, companyId: string): Promise<{
    messages: OutreachMessage[];
    personalization_insights: string[];
    follow_up_plan: any;
    success_probability: number;
  }> {
    try {
      this.updateStatus('busy');
      
      const messages = await this.generatePersonalizedMessages(investorData);
      const insights = this.analyzePersonalizationOpportunities(investorData);
      const followUpPlan = this.createFollowUpPlan(investorData);
      const successProbability = this.calculateSuccessProbability(investorData, messages);
      
      await this.logActivity({
        type: 'outreach_creation',
        message: `Created personalized outreach for ${investorData.name}`,
        data: { 
          investor_name: investorData.name,
          message_count: messages.length,
          channels: this.config.outreach_channels
        }
      });

      this.updateStatus('active');
      
      return {
        messages,
        personalization_insights: insights,
        follow_up_plan: followUpPlan,
        success_probability: successProbability
      };
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to create personalized outreach: ${error}`);
    }
  }

  async sendOutreachMessage(message: OutreachMessage): Promise<{
    success: boolean;
    message_id?: string;
    delivery_status: string;
    tracking_data?: any;
  }> {
    try {
      this.updateStatus('busy');
      
      // Simulate sending message
      const result = await this.performMessageSend(message);
      
      await this.logActivity({
        type: 'message_sent',
        message: `Sent ${message.channel} message to ${message.recipient}`,
        data: { 
          recipient: message.recipient,
          channel: message.channel,
          message_id: result.message_id
        }
      });

      this.updateStatus('active');
      return result;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to send outreach message: ${error}`);
    }
  }

  async handleResponse(response: {
    message_id: string;
    recipient: string;
    content: string;
    channel: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }): Promise<{
    should_follow_up: boolean;
    follow_up_message?: string;
    next_action: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }> {
    try {
      this.updateStatus('busy');
      
      const analysis = await this.analyzeResponse(response);
      const followUpDecision = this.decideFollowUp(response, analysis);
      
      await this.logActivity({
        type: 'response_handled',
        message: `Handled response from ${response.recipient}`,
        data: { 
          recipient: response.recipient,
          sentiment: response.sentiment,
          should_follow_up: followUpDecision.should_follow_up
        }
      });

      this.updateStatus('active');
      return followUpDecision;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to handle response: ${error}`);
    }
  }

  async updateCoreObject(coreObjectId: string, outreachData: any): Promise<void> {
    try {
      const updateData = {
        data: {
          ...outreachData,
          last_outreach: new Date().toISOString(),
          outreach_agent: this.id
        }
      };

      console.log(`Updating core object ${coreObjectId} with outreach data`);
      
      await this.logActivity({
        type: 'core_object_update',
        message: `Updated core object ${coreObjectId} with outreach data`,
        data: { core_object_id: coreObjectId }
      });
    } catch (error) {
      throw new Error(`Failed to update core object: ${error}`);
    }
  }

  private async generatePersonalizedMessages(investorData: any): Promise<OutreachMessage[]> {
    const messages: OutreachMessage[] = [];
    
    for (const channel of this.config.outreach_channels) {
      const message = await this.createChannelSpecificMessage(investorData, channel);
      messages.push(message);
    }
    
    return messages;
  }

  private async createChannelSpecificMessage(investorData: any, channel: string): Promise<OutreachMessage> {
    await this.simulateWork(1000);
    
    const personalizationData = this.extractPersonalizationData(investorData);
    
    if (channel === 'email') {
      return {
        recipient: investorData.email || `${investorData.name.toLowerCase().replace(' ', '.')}@example.com`,
        channel: 'email',
        subject: `Partnership opportunity: ${investorData.focus_areas?.[0] || 'SaaS'} company seeking investment`,
        content: this.generateEmailContent(investorData, personalizationData),
        personalization_data: personalizationData,
        status: 'draft'
      };
    } else if (channel === 'linkedin') {
      return {
        recipient: investorData.linkedin_url || `linkedin.com/in/${investorData.name.toLowerCase().replace(' ', '')}`,
        channel: 'linkedin',
        content: this.generateLinkedInContent(investorData, personalizationData),
        personalization_data: personalizationData,
        status: 'draft'
      };
    }
    
    throw new Error(`Unsupported channel: ${channel}`);
  }

  private generateEmailContent(investorData: any, personalizationData: any): string {
    const focusArea = investorData.focus_areas?.[0] || 'B2B SaaS';
    const portfolioSize = investorData.portfolio_size || 'diverse portfolio';
    
    return `Hi ${investorData.name},

I hope this message finds you well. I came across your impressive work at ${investorData.firm} and was particularly struck by your focus on ${focusArea} companies.

I noticed you've successfully invested in companies like ${personalizationData.similar_companies?.join(', ') || 'innovative B2B SaaS companies'}, and I believe there's a strong alignment with what we're building.

Our company has achieved ${personalizationData.company_metrics?.arr || '$1M+'} ARR with ${personalizationData.company_metrics?.growth_rate || '100%+'} growth, and we're looking for a strategic partner who understands the ${focusArea} space.

Would you be interested in a brief conversation to explore potential synergies? I'd be happy to share more details about our traction and vision.

Best regards,
[Your Name]
[Company Name]`;
  }

  private generateLinkedInContent(investorData: any, personalizationData: any): string {
    return `Hi ${investorData.name}, I noticed your work with ${investorData.firm} and your focus on ${investorData.focus_areas?.[0] || 'B2B SaaS'}. Would love to connect and share what we're building - we've hit ${personalizationData.company_metrics?.arr || '$1M+'} ARR and are growing ${personalizationData.company_metrics?.growth_rate || '100%+'}. Any interest in a quick chat?`;
  }

  private extractPersonalizationData(investorData: any): Record<string, any> {
    return {
      focus_areas: investorData.focus_areas,
      investment_stages: investorData.investment_stages,
      portfolio_size: investorData.portfolio_size,
      similar_companies: investorData.portfolio?.slice(0, 3) || [],
      company_metrics: {
        arr: '$1.2M',
        growth_rate: '150%',
        customers: 45,
        team_size: 12
      }
    };
  }

  private analyzePersonalizationOpportunities(investorData: any): string[] {
    const insights: string[] = [];
    
    if (investorData.focus_areas?.length > 0) {
      insights.push(`Strong alignment with ${investorData.focus_areas[0]} focus area`);
    }
    
    if (investorData.portfolio?.length > 0) {
      insights.push(`Can reference similar portfolio companies: ${investorData.portfolio.slice(0, 2).join(', ')}`);
    }
    
    if (investorData.investment_stages?.length > 0) {
      insights.push(`Matches preferred investment stage: ${investorData.investment_stages[0]}`);
    }
    
    return insights;
  }

  private createFollowUpPlan(investorData: any): any {
    return {
      sequence: [
        {
          day: 3,
          type: 'follow_up',
          channel: 'email',
          content: 'Gentle follow-up on initial outreach'
        },
        {
          day: 7,
          type: 'value_add',
          channel: 'linkedin',
          content: 'Share relevant industry insights or company update'
        },
        {
          day: 14,
          type: 'final_attempt',
          channel: 'email',
          content: 'Final attempt with different angle'
        }
      ],
      triggers: {
        on_response: 'immediate_reply',
        on_no_response: 'continue_sequence',
        on_negative_response: 'respectful_closure'
      }
    };
  }

  private calculateSuccessProbability(investorData: any, messages: OutreachMessage[]): number {
    let probability = 50; // Base probability
    
    // Adjust based on personalization
    if (this.config.personalization_level === 'high') {
      probability += 15;
    }
    
    // Adjust based on channel diversity
    if (messages.length > 1) {
      probability += 10;
    }
    
    // Adjust based on investor data quality
    if (investorData.email && investorData.linkedin_url) {
      probability += 10;
    }
    
    return Math.min(probability, 95); // Cap at 95%
  }

  private async performMessageSend(message: OutreachMessage): Promise<any> {
    await this.simulateWork(500);
    
    return {
      success: true,
      message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      delivery_status: 'delivered',
      tracking_data: {
        opened: false,
        clicked: false,
        replied: false
      }
    };
  }

  private async analyzeResponse(response: any): Promise<any> {
    await this.simulateWork(300);
    
    return {
      sentiment: response.sentiment || 'neutral',
      intent: this.detectIntent(response.content),
      urgency: this.assessUrgency(response.content),
      next_best_action: this.determineNextAction(response)
    };
  }

  private detectIntent(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('interested') || lowerContent.includes('sounds good')) {
      return 'positive_interest';
    } else if (lowerContent.includes('not interested') || lowerContent.includes('pass')) {
      return 'negative_response';
    } else if (lowerContent.includes('more info') || lowerContent.includes('details')) {
      return 'requesting_info';
    }
    
    return 'neutral';
  }

  private assessUrgency(content: string): 'low' | 'medium' | 'high' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('urgent') || lowerContent.includes('asap')) {
      return 'high';
    } else if (lowerContent.includes('soon') || lowerContent.includes('this week')) {
      return 'medium';
    }
    
    return 'low';
  }

  private determineNextAction(response: any): string {
    if (response.sentiment === 'positive') {
      return 'schedule_meeting';
    } else if (response.sentiment === 'negative') {
      return 'respectful_closure';
    } else {
      return 'provide_more_info';
    }
  }

  private decideFollowUp(response: any, analysis: any): any {
    const shouldFollowUp = analysis.intent !== 'negative_response';
    
    if (!shouldFollowUp) {
      return {
        should_follow_up: false,
        next_action: 'respectful_closure',
        priority: 'low' as const
      };
    }
    
    let followUpMessage: string | undefined;
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    
    if (analysis.intent === 'positive_interest') {
      followUpMessage = 'Great! I\'d love to schedule a call to discuss this further. What times work best for you this week?';
      priority = 'high';
    } else if (analysis.intent === 'requesting_info') {
      followUpMessage = 'I\'d be happy to share more details. Would you prefer a pitch deck, financials, or a brief call?';
      priority = 'medium';
    }
    
    return {
      should_follow_up: shouldFollowUp,
      follow_up_message: followUpMessage,
      next_action: analysis.next_best_action,
      priority
    };
  }

  private async simulateWork(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
} 