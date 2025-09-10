
import { IncidentPriority, Portfolio, Incident, KnowledgeArticle } from './types';

export const PORTFOLIOS: Portfolio[] = [
  { id: 'digital-channels', name: 'Digital Channels' },
  { id: 'core-insurance-systems', name: 'Core Insurance Systems' },
  { id: 'data-analytics-platform', name: 'Data & Analytics Platform' },
  { id: 'corporate-services', name: 'Corporate Services' },
];

export const INCIDENTS: Incident[] = [
  {
    id: 'INC001',
    title: 'Mobile App Login Failure',
    description: 'Users on iOS 17.5 are reporting intermittent login failures. The issue seems to be related to a recent certificate update on our authentication gateway. API logs show SSL handshake errors for affected users.',
    priority: IncidentPriority.P1,
    portfolioId: 'digital-channels',
    slaBreachTime: 'in 30 minutes',
    affectedServices: ['Mobile App', 'Authentication API'],
    lastUpdate: 'Team is investigating the certificate chain on the gateway.',
    commentHistory: [
        { author: 'MonitoringBot', timestamp: '2 hours ago', comment: 'Alert triggered: 5xx error rate on Auth API exceeds threshold.'},
        { author: 'On-Call Engineer', timestamp: '1 hour ago', comment: 'Acknowledged. Initial investigation points to SSL errors. Correlates with recent cert push.'},
        { author: 'SRE Team Lead', timestamp: '30 mins ago', comment: 'Confirming this is P1. All hands on deck. Customer support is reporting high call volume.'}
    ]
  },
  {
    id: 'INC002',
    title: 'Claim Processing Delay',
    description: 'The overnight batch job for processing new claims has been running for 8 hours, significantly longer than the usual 2 hours. This is causing delays in claim adjudication and payment processing. No errors are reported, but CPU usage on the processing server is at 100%.',
    priority: IncidentPriority.P2,
    portfolioId: 'core-insurance-systems',
    slaBreachTime: 'in 2 hours',
    affectedServices: ['Claims Processing Engine', 'Payment Gateway'],
    lastUpdate: 'DBA team is analyzing long-running queries.',
    commentHistory: [
        { author: 'DBA Team', timestamp: '3 hours ago', comment: 'We\'ve identified a query that is not using the correct index. Working on a plan to kill the query and rebuild indexes.'},
        { author: 'App Owner', timestamp: '1 hour ago', comment: 'What is the ETA for resolution? This is impacting our payment cycle.'},
    ]
  },
  {
    id: 'INC003',
    title: 'Analytics Dashboard Not Loading',
    description: 'The main executive dashboard is timing out and not loading any data. All widgets are showing a loading spinner indefinitely. The underlying data warehouse connection test is failing from the dashboard server.',
    priority: IncidentPriority.P2,
    portfolioId: 'data-analytics-platform',
    slaBreachTime: 'in 4 hours',
    affectedServices: ['Executive Dashboard', 'Data Warehouse'],
    lastUpdate: 'Network team is checking firewall rules between dashboard and warehouse servers.',
    commentHistory: [
        { author: 'BI Team', timestamp: '4 hours ago', comment: 'We can\'t connect to the data warehouse. This is a blocker for morning reports.'},
        { author: 'Network Ops', timestamp: '2 hours ago', comment: 'We see dropped packets between the app server and the DWH. A firewall change was made last night. Investigating.'},
    ]
  },
  {
    id: 'INC004',
    title: 'HR Portal Slow Performance',
    description: 'Employees are reporting that the HR portal is extremely slow, especially when accessing payroll information. Page load times are exceeding 30 seconds. Initial investigation points to high memory utilization on the application server.',
    priority: IncidentPriority.P3,
    portfolioId: 'corporate-services',
    slaBreachTime: 'in 8 hours',
    affectedServices: ['HR Portal', 'Payroll Service'],
    lastUpdate: 'System admins are scheduled to restart the application server during the next maintenance window.',
    commentHistory: [
        { author: 'Help Desk', timestamp: '1 day ago', comment: 'Multiple users reporting slowness. Escalating to the portal support team.'},
        { author: 'SysAdmin', timestamp: '4 hours ago', comment: 'Confirmed a memory leak in the main application process. A restart will provide temporary relief. A patch is needed for a permanent fix.'},
    ]
  },
    {
    id: 'INC005',
    title: 'New Member Enrollment Failing',
    description: 'The API endpoint for new member enrollment is returning a 500 Internal Server Error. This is preventing new customers from signing up for plans via our public website. The issue started after the deployment of version 2.3.1 of the member service.',
    priority: IncidentPriority.P1,
    portfolioId: 'digital-channels',
    slaBreachTime: 'in 1 hour',
    affectedServices: ['Member Enrollment API', 'Public Website'],
    lastUpdate: 'DevOps team is preparing to roll back the latest deployment.',
    commentHistory: [
        { author: 'DevOps', timestamp: '1 hour ago', comment: 'Deployment v2.3.1 completed. Monitoring looks green.'},
        { author: 'MonitoringBot', timestamp: '45 mins ago', comment: 'Alert: 5xx error rate on Enrollment API is critical.'},
        { author: 'Dev Lead', timestamp: '15 mins ago', comment: 'This is a code issue. Authorizing immediate rollback to v2.3.0.'},
    ]
  },
  {
    id: 'INC006',
    title: 'Provider Directory Search Timeout',
    description: 'Searches in the provider directory are timing out for complex queries (e.g., searching by specialty in a large metropolitan area). Simple searches by name are still working correctly. This is impacting call center agents assisting members.',
    priority: IncidentPriority.P3,
    portfolioId: 'core-insurance-systems',
    slaBreachTime: 'in 12 hours',
    affectedServices: ['Provider Directory Service', 'Call Center Tools'],
    lastUpdate: 'Investigating potential index issues in the provider database.',
    commentHistory: [
        { author: 'Call Center Lead', timestamp: '6 hours ago', comment: 'Agents are unable to search for specialists, leading to longer call times.'},
        { author: 'DBA Team', timestamp: '1 hour ago', comment: 'Query plan analysis shows a full table scan. The search query is not using the specialty index. Investigating why.'},
    ]
  },
   {
    id: 'INC007',
    title: 'Payment Gateway Connection Errors',
    description: 'Our primary payment gateway is intermittently returning "Connection Refused" errors. This is affecting member premium payments and provider reimbursements. The issue appears to be network-related, possibly with the external vendor.',
    priority: IncidentPriority.P1,
    portfolioId: 'core-insurance-systems',
    slaBreachTime: 'in 45 minutes',
    affectedServices: ['Payment Gateway', 'Member Portal', 'Provider Portal'],
    lastUpdate: 'Contacted vendor support; awaiting response. Monitoring network latency.',
    commentHistory: [
        { author: 'Finance Ops', timestamp: '2 hours ago', comment: 'We are seeing a high failure rate on payment transactions. This has significant financial impact.'},
        { author: 'Network Ops', timestamp: '1 hour ago', comment: 'Traceroute shows packet loss outside our network. It seems to be an issue with the vendor\'s endpoint.'},
        { author: 'Vendor Support', timestamp: '10 mins ago', comment: '(Via Email) We are aware of the issue and our network team is currently investigating. No ETA at this time.'},
    ]
  },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  { id: 'KB00101', title: 'Troubleshooting SSL Handshake Errors', summary: 'Common causes and resolution steps for SSL/TLS handshake failures, including expired or misconfigured certificates.' },
  { id: 'KB00102', title: 'Rolling Back a Production Deployment', summary: 'Standard operating procedure for safely rolling back a failed deployment in the production environment using our CI/CD pipeline.' },
  { id: 'KB00201', title: 'Diagnosing High CPU Usage on Batch Servers', summary: 'Steps to identify the root cause of high CPU utilization, including performance tuning for long-running database queries.' },
  { id: 'KB00202', title: 'Optimizing Database Indexing for Search', summary: 'Best practices for creating and maintaining database indexes to improve the performance of complex search queries.' },
  { id: 'KB00301', title: 'Resolving Data Warehouse Connectivity Issues', summary: 'Checklist for troubleshooting network connectivity problems between application servers and the data warehouse, including firewall and security group verification.' },
];


export const PRIORITY_CONFIG: Record<IncidentPriority, { label: string; base: string; background: string; text: string; ring: string; }> = {
  [IncidentPriority.P1]: {
    label: 'Critical',
    base: 'border-red-500',
    background: 'bg-red-50',
    text: 'text-red-800',
    ring: 'ring-red-600/20'
  },
  [IncidentPriority.P2]: {
    label: 'High',
    base: 'border-amber-500',
    background: 'bg-amber-50',
    text: 'text-amber-800',
    ring: 'ring-amber-600/20'
  },
  [IncidentPriority.P3]: {
    label: 'Medium',
    base: 'border-sky-500',
    background: 'bg-sky-50',
    text: 'text-sky-800',
    ring: 'ring-sky-600/20'
  },
  [IncidentPriority.P4]: {
    label: 'Low',
    base: 'border-gray-400',
    background: 'bg-gray-50',
    text: 'text-gray-700',
    ring: 'ring-gray-500/20'
  },
};
