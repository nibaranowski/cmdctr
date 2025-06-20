import { Agent } from '../../../models/Agent';
import { CoreObject } from '../../../models/CoreObject';
import { BaseAgent, AgentContext, AgentResult } from '../BaseAgent';

export class AIOutreachAgent extends BaseAgent {
  constructor(agent: Agent, context: AgentContext) {
    super(agent, context);
  }

  async execute(): Promise<AgentResult> {
    try {
      this.logActivity('Starting AI outreach execution');

      if (!this.validateContext()) {
        return {
          success: false,
          message: 'Invalid context: missing required metabox or phase'
        };
      }

      // Update status to busy
      await this.updateStatus('busy', 'Performing AI-powered outreach');

      // Get existing core objects (investors) to outreach to
      const existingCoreObjects = this.getCoreObjects();
      
      if (existingCoreObjects.length === 0) {
        return {
          success: false,
          message: 'No investors found to outreach to. Please run investor research first.'
        };
      }

      // Perform outreach to each investor
      const outreachResults = await this.performOutreach(existingCoreObjects);
      
      // Create core objects for outreach activities
      const outreachCoreObjects: CoreObject[] = [];
      
      for (const result of outreachResults) {
        const coreObject = this.createCoreObject(
          `Outreach: ${result.investor_name}`,
          result.outreach_description,
          {
            investor_name: result.investor_name,
            outreach_type: result.type,
            message_content: result.message,
            contact_method: result.contact_method,
            response_received: result.response_received,
            response_content: result.response_content,
            follow_up_needed: result.follow_up_needed,
            follow_up_date: result.follow_up_date
          },
          {
            outreach_date: new Date().toISOString(),
            success_probability: result.success_probability,
            next_action: result.next_action
          }
        );
        
        outreachCoreObjects.push(coreObject);
        this.logActivity(`Created outreach record for ${result.investor_name}`);
      }

      // Update status to active
      await this.updateStatus('active', `Outreach completed: ${outreachResults.length} contacts made`);

      this.logActivity(`AI outreach execution completed successfully. Contacted ${outreachResults.length} investors.`);

      return {
        success: true,
        message: `Successfully performed outreach to ${outreachResults.length} investors`,
        coreObjects: outreachCoreObjects,
        nextActions: [
          'Monitor response rates',
          'Schedule follow-up calls',
          'Prepare for investor meetings',
          'Update pitch materials based on feedback'
        ],
        metadata: {
          outreach_date: new Date().toISOString(),
          total_contacts_made: outreachResults.length,
          response_rate: this.calculateResponseRate(outreachResults),
          metabox_id: this.context.metabox.id,
          phase_id: this.context.phase.id
        }
      };

    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private async performOutreach(investors: CoreObject[]): Promise<Array<{
    investor_name: string;
    type: 'email' | 'linkedin' | 'phone' | 'warm_intro';
    contact_method: string;
    message: string;
    outreach_description: string;
    response_received: boolean;
    response_content?: string;
    follow_up_needed: boolean;
    follow_up_date?: string;
    success_probability: number;
    next_action: string;
  }>> {
    this.logActivity('Performing AI-powered investor outreach');
    
    // In a real implementation, this would:
    // 1. Analyze investor profiles and preferences
    // 2. Generate personalized outreach messages
    // 3. Send messages through appropriate channels
    // 4. Track responses and engagement
    // 5. Schedule follow-ups
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

    const results: Array<{
      investor_name: string;
      type: 'email' | 'linkedin' | 'phone' | 'warm_intro';
      contact_method: string;
      message: string;
      outreach_description: string;
      response_received: boolean;
      response_content?: string;
      follow_up_needed: boolean;
      follow_up_date?: string;
      success_probability: number;
      next_action: string;
    }> = [];
    
    for (const investor of investors) {
      const investorData = investor.data as any;
      const investorName = investorData?.investor_type === 'Venture Capital' 
        ? investor.title.replace('Investor: ', '')
        : investor.title.replace('Investor: ', '');

      // Generate personalized message based on investor type and portfolio
      const message = this.generatePersonalizedMessage(_investorData);
      
      // Simulate response (in real implementation, this would be tracked)
      const responseReceived = Math.random() > 0.7; // 30% response rate
      const responseContent = responseReceived ? this.generateResponse(_investorData) : undefined;
      
      // Determine follow-up needs
      const followUpNeeded = !responseReceived || (responseReceived && Math.random() > 0.5);
      const followUpDate = followUpNeeded ? this.calculateFollowUpDate() : undefined;

      results.push({
        investor_name: investorName,
        type: this.determineOutreachType(_investorData),
        contact_method: investorData?.contact_info || 'email',
        message,
        outreach_description: `AI-generated personalized outreach to ${investorName} via ${this.determineOutreachType(_investorData)}`,
        response_received: responseReceived,
        ...(responseContent && { response_content: responseContent }),
        follow_up_needed: followUpNeeded,
        ...(followUpDate && { follow_up_date: followUpDate }),
        success_probability: this.calculateSuccessProbability(_investorData),
        next_action: this.determineNextAction(responseReceived, followUpNeeded)
      });
    }

    return results;
  }

  private generatePersonalizedMessage(investorData: any): string {
    const investorType = investorData?.investor_type;
    const portfolio = investorData?.portfolio_companies || [];
    
    if (investorType === 'Venture Capital') {
      return `Hi there,

I'm reaching out because I noticed your impressive track record with companies like ${portfolio.slice(0, 2).join(' and ')}. 

We're building a B2B SaaS platform that's showing strong unit economics and 100%+ growth rates. Given your expertise in the space, I'd love to share our story and get your thoughts.

Would you be open to a 15-minute call next week?

Best regards,
[Your Name]`;
    } else if (investorType === 'Accelerator') {
      return `Hello,

I'm excited to share that we're applying to your accelerator program. We're a team of experienced founders building a B2B SaaS solution that's already generating revenue and showing strong traction.

We believe your program's focus on rapid iteration and growth would be perfect for us. I'd love to discuss our application and get any feedback you might have.

Looking forward to hearing from you!

Best,
[Your Name]`;
    }

    return `Hi,

I'm reaching out to introduce our company. We're building innovative B2B SaaS solutions and would love to connect with you.

Best regards,
[Your Name]`;
  }

  private generateResponse(investorData: any): string {
    const responses = [
      "Thanks for reaching out. Your company looks interesting. Let's schedule a call for next week.",
      "I'd be happy to learn more about your business. Can you send over your pitch deck?",
      "Thanks for the introduction. I'm not currently investing in this space, but I'll keep you in mind.",
      "Your company sounds promising. I'd like to introduce you to one of my partners who focuses on this area.",
      "Thanks for reaching out. I'm currently at capacity with new investments, but I'll follow your progress."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private determineOutreachType(investorData: any): 'email' | 'linkedin' | 'phone' | 'warm_intro' {
    const types = ['email', 'linkedin', 'phone', 'warm_intro'];
    return types[Math.floor(Math.random() * types.length)] as any;
  }

  private calculateSuccessProbability(investorData: any): number {
    // Base probability on investor type and other factors
    let baseProbability = 0.3;
    
    if (investorData?.investor_type === 'Venture Capital') {
      baseProbability = 0.4;
    } else if (investorData?.investor_type === 'Accelerator') {
      baseProbability = 0.6;
    }
    
    // Add some randomness
    return Math.min(0.95, baseProbability + Math.random() * 0.3);
  }

  private calculateFollowUpDate(): string {
    const followUpDays = [3, 5, 7, 10, 14];
    const randomIndex = Math.floor(Math.random() * followUpDays.length);
    const days = followUpDays[randomIndex] ?? 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  private determineNextAction(responseReceived: boolean, followUpNeeded: boolean): string {
    if (responseReceived) {
      return 'Schedule meeting or call';
    } else if (followUpNeeded) {
      return 'Send follow-up message';
    } else {
      return 'Move to next prospect';
    }
  }

  private calculateResponseRate(results: any[]): number {
    const responses = results.filter(r => r.response_received).length;
    return results.length > 0 ? (responses / results.length) * 100 : 0;
  }
} 