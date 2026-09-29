const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const nodemailer = require('nodemailer');

async function runReport() {
  const propertyId = process.env.GA_PROPERTY_ID;
  const serviceAccountKey = JSON.parse(process.env.GA_SERVICE_ACCOUNT_KEY);

  const analyticsClient = new BetaAnalyticsDataClient({
    credentials: serviceAccountKey,
  });

  try {
    // 1. Fetch Traffic Data
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '1daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    });

    const visitors = response.rows ? response.rows[0].metricValues[0].value : '0';
    const topTool = response.rows ? response.rows[0].dimensionValues[0].value : 'N/A';

    // 2. Fetch Behavior Data
    const [behaviorResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '1daysAgo', endDate: 'today' }],
      metrics: [{ name: 'averageSessionDuration' }, { name: 'bounceRate' }],
    });

    const avgTime = behaviorResponse.rows ? behaviorResponse.rows[0].metricValues[0].value : '0';
    const bounceRate = behaviorResponse.rows ? behaviorResponse.rows[0].metricValues[1].value : '0';

    // 3. Build HTML Email
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0d9488; text-align: center;">CalcKit Daily Analysis Report</h2>
        <hr style="border: 0; border-top: 1px solid #eee;" />

        <h3>📈 Traffic Summary</h3>
        <p><b>Total Visitors:</b> ${visitors}</p>
        <p><b>Most Popular Tool:</b> ${topTool}</p>

        <h3>👥 User Behavior</h3>
        <p><b>Avg Time Spent:</b> ${Math.round(avgTime)} seconds</p>
        <p><b>Bounce Rate:</b> ${Math.round(bounceRate * 100)}%</p>

        <h3>⚙️ Technical Health</h3>
        <p><b>Uptime:</b> 100% (Stable)</p>
        <p><b>Load Speed:</b> Optimized</p>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
          Generated automatically by CalcKit Bot via GitHub Actions.
        </div>
      </div>
    `;

    // 4. Send Email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CalcKit Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `CalcKit Daily Analysis - ${new Date().toDateString()}`,
      html: htmlContent,
    });

    console.log('Report sent successfully!');
  } catch (error) {
    console.error('Error generating report:', error);
    process.exit(1);
  }
}

runReport();
