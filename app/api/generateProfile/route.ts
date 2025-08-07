import { NextRequest, NextResponse } from 'next/server'

// Mock analysis templates based on different company types/industries
const MOCK_ANALYSES = {
  printing: {
    executiveSummary: "Mid-market printing company with strong regional presence. Revenue estimated at $15-60M based on employee count and market position. Leadership demonstrates growth-oriented mindset with focus on operational efficiency and technology adoption.",
    
    professionalBackground: "Experienced industry veteran with 15+ years in printing/manufacturing sector. Career trajectory shows progression from operational roles to executive leadership. Demonstrates pattern of scaling businesses through strategic investments and process optimization.",
    
    businessContext: "Recent expansion into digital printing capabilities. Invested in new equipment within last 18 months. Growing customer base in packaging and label segments. Potential acquisition discussions in regional market.",
    
    digitalPresence: "Moderate LinkedIn activity with focus on industry trends and company updates. Limited thought leadership content but consistent engagement with industry peers. Company website recently updated, suggesting investment in digital presence.",
    
    behavioralProfile: "**Confidence Level: Medium**\n\nAnalytical decision-maker with measured approach to new investments. Values data-driven solutions and proven ROI. Communication style tends toward direct, results-focused discussions. Risk tolerance appears moderate - willing to invest in proven technologies but cautious about unproven solutions.",
    
    riskFlags: "• Technology debt from legacy systems requiring modernization\n• Supplier concentration risk with limited vendor diversity\n• Potential cash flow constraints during equipment financing cycles\n• Succession planning concerns in family-owned operations\n• Market consolidation pressure from larger competitors",
    
    opportunityAssessment: "Strong opportunity window due to recent growth phase and technology investments. Pain points likely include operational efficiency, cost management, and competitive differentiation. Decision-making authority appears centralized. Timing favorable due to expansion mindset.",
    
    keyContacts: "• **Primary Contact**: [Target Name]\n  - LinkedIn: linkedin.com/in/[target-name]\n  - Email Pattern: first.last@company.com\n  - Title: [Current Title]\n\n• **Secondary Contacts**: Operations Manager, CFO\n  - Email Pattern: first.last@company.com",
    
    recommendedApproach: "**5-Step Tactical Outreach Plan:**\n\n1. **Open with Industry Benchmark**: Share relevant operational efficiency metrics from similar-sized printing companies\n\n2. **Context-Rich Questions**: \n   - \"How are you managing the balance between new equipment investments and operational cash flow?\"\n   - \"What's your biggest challenge in scaling operations while maintaining quality standards?\"\n\n3. **Business Value Connection**: Tie solutions to measurable outcomes - cost reduction, efficiency gains, or revenue growth opportunities\n\n4. **Social Proof**: Present case study from similar printing company showing 15-20% efficiency improvement or cost savings\n\n5. **Low-Friction Next Step**: Offer brief operational assessment or ROI calculator specific to their equipment/volume profile"
  },
  
  labels: {
    executiveSummary: "Specialized label manufacturing company serving diverse industrial clients. Revenue range $10-40M with focus on custom solutions and quick turnaround times. Leadership emphasizes customer service excellence and operational flexibility.",
    
    professionalBackground: "Deep industry expertise with focus on customer relationships and operational excellence. Career path shows commitment to label/packaging sector with emphasis on service differentiation and quality control.",
    
    businessContext: "Investing in digital printing capabilities to serve shorter runs and custom applications. Potential expansion into sustainable/eco-friendly label materials. Strong customer retention rates indicating solid market position.",
    
    digitalPresence: "Limited digital footprint with focus on direct customer relationships rather than online presence. Company relies heavily on referrals and repeat business. Website functional but not optimized for lead generation.",
    
    behavioralProfile: "**Confidence Level: Medium-High**\n\nRelationship-focused decision maker who values long-term partnerships over transactional relationships. Conservative approach to major investments but willing to invest in customer service improvements. Prefers proven solutions with strong support.",
    
    riskFlags: "• Heavy reliance on key customer relationships\n• Limited digital marketing presence\n• Potential capacity constraints during peak seasons\n• Aging equipment requiring maintenance/replacement\n• Competition from larger, more automated facilities",
    
    opportunityAssessment: "Excellent relationship-building opportunity. Pain points likely include capacity management, customer service efficiency, and competitive pricing pressure. Values solutions that enhance customer satisfaction and operational reliability.",
    
    keyContacts: "• **Primary Contact**: [Target Name]\n  - LinkedIn: linkedin.com/in/[target-name]\n  - Email Pattern: first.last@company.com\n  - Title: [Current Title]\n\n• **Secondary Contacts**: Production Manager, Sales Manager\n  - Email Pattern: first.last@company.com",
    
    recommendedApproach: "**5-Step Tactical Outreach Plan:**\n\n1. **Relationship-First Opening**: Reference mutual connections or shared industry challenges rather than leading with product pitch\n\n2. **Service-Focused Questions**:\n   - \"What's your biggest challenge in maintaining quick turnaround times during peak seasons?\"\n   - \"How do you balance custom service requirements with operational efficiency?\"\n\n3. **Customer Impact Focus**: Connect solutions to improved customer satisfaction, faster delivery, or enhanced service capabilities\n\n4. **Peer Reference**: Share example from similar family-owned label company emphasizing service improvements and customer retention\n\n5. **Consultative Next Step**: Offer operational review focused on customer service enhancement rather than cost reduction"
  },
  
  default: {
    executiveSummary: "Growing mid-market company with strong market position in their sector. Leadership demonstrates strategic thinking and growth orientation. Revenue estimated in $10-50M range based on market presence and operational scale.",
    
    professionalBackground: "Experienced professional with solid track record in their industry. Career progression shows increasing responsibility and strategic focus. Demonstrates ability to scale operations and drive business growth.",
    
    businessContext: "Company in growth phase with recent investments in capabilities and market expansion. Strong competitive position with focus on operational excellence and customer satisfaction.",
    
    digitalPresence: "Professional online presence with regular industry engagement. Demonstrates thought leadership through content sharing and industry participation. Company maintains modern digital footprint.",
    
    behavioralProfile: "**Confidence Level: Medium**\n\nStrategic decision-maker with balanced approach to risk and growth. Values data-driven solutions and measurable outcomes. Communication style professional and results-oriented.",
    
    riskFlags: "• Scaling challenges as company grows\n• Competitive pressure in evolving market\n• Technology modernization requirements\n• Talent acquisition and retention\n• Capital allocation for growth investments",
    
    opportunityAssessment: "Strong opportunity for strategic partnership. Pain points likely include operational efficiency, growth management, and competitive differentiation. Decision-making process appears structured and thorough.",
    
    keyContacts: "• **Primary Contact**: [Target Name]\n  - LinkedIn: linkedin.com/in/[target-name]\n  - Email Pattern: first.last@company.com\n  - Title: [Current Title]\n\n• **Secondary Contacts**: Operations team, Finance team\n  - Email Pattern: first.last@company.com",
    
    recommendedApproach: "**5-Step Tactical Outreach Plan:**\n\n1. **Strategic Opening**: Lead with industry insight or market trend relevant to their growth objectives\n\n2. **Growth-Focused Questions**:\n   - \"What's your biggest operational challenge as you scale the business?\"\n   - \"How are you managing the balance between growth investments and operational efficiency?\"\n\n3. **Strategic Value**: Connect solutions to growth enablement, competitive advantage, or operational scalability\n\n4. **Growth Case Study**: Present example from similar company showing successful scaling or efficiency improvements\n\n5. **Strategic Next Step**: Offer strategic assessment or growth planning discussion rather than product demo"
  }
}

function generateMockAnalysis(prospectName: string, companyName: string, additionalContext?: string): string {
  // Determine analysis type based on company name or context
  let analysisType = 'default'
  const companyLower = companyName.toLowerCase()
  const contextLower = (additionalContext || '').toLowerCase()
  
  if (companyLower.includes('print') || companyLower.includes('catapult') || contextLower.includes('print')) {
    analysisType = 'printing'
  } else if (companyLower.includes('label') || companyLower.includes('abbott') || contextLower.includes('label')) {
    analysisType = 'labels'
  }
  
  const template = MOCK_ANALYSES[analysisType as keyof typeof MOCK_ANALYSES]
  
  return `# PRIVATE EYE INTELLIGENCE ANALYSIS
**TARGET**: ${prospectName}
**COMPANY**: ${companyName}
**CLASSIFICATION**: CONFIDENTIAL
**GENERATED**: ${new Date().toLocaleDateString()}

---

## 1. **Executive Summary**

${template.executiveSummary}

## 2. **Professional Background & Career Trajectory**

${template.professionalBackground}

## 3. **Business Context & Recent Developments**

${template.businessContext}

## 4. **Digital Presence Analysis**

${template.digitalPresence}

## 5. **Behavioral & Decision-Making Profile**

${template.behavioralProfile}

## 6. **Strategic Risk Flags**

${template.riskFlags}

## 7. **Opportunity Assessment**

${template.opportunityAssessment}

## 8. **Key Contact Points & Profiles**

${template.keyContacts.replace(/\[Target Name\]/g, prospectName).replace(/\[Current Title\]/g, 'Executive Leadership')}

## 9. **Recommended Approach**

${template.recommendedApproach}

---

**INTELLIGENCE DISCLAIMER**: This analysis is generated using publicly available information and analytical frameworks. All recommendations should be validated through direct engagement and additional research. Use in compliance with applicable privacy regulations and ethical sales practices.

**NEXT ACTIONS**: 
- Validate contact information through LinkedIn/company website
- Research recent company news and developments  
- Prepare customized outreach materials based on recommended approach
- Schedule follow-up analysis if additional intelligence required`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prospectName, companyName, additionalContext } = body

    if (!prospectName || !companyName) {
      return NextResponse.json(
        { error: 'Prospect name and company name are required' },
        { status: 400 }
      )
    }

    // Simulate processing time for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock analysis
    const rawAnalysis = generateMockAnalysis(prospectName, companyName, additionalContext)
    
    // Parse the generated profile into structured sections
    const sections = parseProfileSections(rawAnalysis)

    return NextResponse.json({
      success: true,
      profile: {
        prospectName,
        companyName,
        generatedAt: new Date().toISOString(),
        rawAnalysis,
        sections,
      }
    })

  } catch (error) {
    console.error('Profile generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate profile analysis' },
      { status: 500 }
    )
  }
}

function parseProfileSections(text: string) {
  const sections: Record<string, string> = {}
  
  const sectionTitles = [
    'Executive Summary',
    'Professional Background & Career Trajectory',
    'Business Context & Recent Developments',
    'Digital Presence Analysis',
    'Behavioral & Decision-Making Profile',
    'Strategic Risk Flags',
    'Opportunity Assessment',
    'Key Contact Points & Profiles',
    'Recommended Approach'
  ]

  sectionTitles.forEach((title) => {
    const regex = new RegExp(`##\\s*\\d+\\.\\s*\\*\\*${title}\\*\\*([\\s\\S]*?)(?=##\\s*\\d+\\.|$)`, 'i')
    const match = text.match(regex)
    if (match) {
      sections[title.toLowerCase().replace(/[^a-z0-9]/g, '_')] = match[1].trim()
    }
  })

  return sections
}
