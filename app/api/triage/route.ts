import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, location, description, severity, peopleAffected } = await req.json();

    const userMessage = `Incident: ${title}. Location: ${location}. Description: ${description}. Severity reported: ${severity}. People affected: ${peopleAffected}.`;

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY!,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages: [
          {
            role: 'system',
            content: 'You are a crisis triage AI for emergency response. Analyze the incident and respond ONLY in JSON format with these fields: severity_score (0-100), urgency (Critical/High/Medium/Low), recommended_action (one sentence), resources_needed (array of strings), estimated_response_time (string)',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let triageData;
    try {
      triageData = JSON.parse(content);
    } catch {
      triageData = {
        severity_score: 50,
        urgency: severity,
        recommended_action: 'Assess the situation and deploy appropriate resources.',
        resources_needed: ['Emergency Response Team', 'Medical Units'],
        estimated_response_time: '15-30 minutes',
      };
    }

    return NextResponse.json(triageData);
  } catch (error) {
    console.error('Triage error:', error);
    return NextResponse.json(
      {
        severity_score: 50,
        urgency: 'Medium',
        recommended_action: 'Manual assessment required.',
        resources_needed: ['Emergency Response Team'],
        estimated_response_time: 'TBD',
      },
      { status: 200 }
    );
  }
}
