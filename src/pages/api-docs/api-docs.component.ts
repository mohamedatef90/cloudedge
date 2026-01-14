import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';

interface ApiSection {
  id: string;
  title: string;
  content: string;
  endpoints?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    curl: string;
    response: string;
  }[];
}

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiDocsComponent {
  activeSectionId = signal('introduction');

  sections: ApiSection[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `
        <p>Welcome to the CloudEdge API documentation. Our API is organized around REST and allows you to programmatically manage your cloud resources.</p>
        <p>All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.</p>
      `
    },
    {
      id: 'authentication',
      title: 'Authentication',
      content: `
        <p>The CloudEdge API uses API Keys to authenticate requests. You can view and manage your API keys in the CloudEdge Dashboard under your account settings.</p>
        <p>Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
        <p>Authentication to the API is performed via HTTP Bearer authentication. Provide your API key in the Authorization header when making requests.</p>
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
      `
    },
    {
      id: 'vms',
      title: 'Virtual Machines',
      content: 'API endpoints for managing your Virtual Machines.',
      endpoints: [
        {
          method: 'GET',
          path: '/v1/vms',
          description: 'Retrieves a list of all your virtual machines.',
          curl: 'curl https://api.worldposta.cloud/v1/vms \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: `
{
  "data": [
    {
      "id": "vm-01",
      "name": "prod-web-server-01",
      "status": "running",
      "cores": 4,
      "memory_gb": 8
    },
    ...
  ]
}`
        },
        {
          method: 'POST',
          path: '/v1/vms',
          description: 'Creates a new virtual machine.',
          curl: `curl https://api.worldposta.cloud/v1/vms \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "new-dev-server",
    "os_image": "ubuntu-22.04",
    "cores": 2,
    "memory_gb": 4
  }'`,
          response: `
{
  "id": "vm-99",
  "name": "new-dev-server",
  "status": "provisioning",
  ...
}`
        }
      ]
    },
    {
      id: 'gateways',
      title: 'Gateways',
      content: 'API endpoints for managing your network gateways.',
      endpoints: [
        {
          method: 'GET',
          path: '/v1/gateways',
          description: 'Retrieves a list of all your network gateways.',
          curl: 'curl https://api.worldposta.cloud/v1/gateways \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
          response: `
{
  "data": [
    {
      "id": "gw-1",
      "name": "Primary-Edge-Gateway",
      "subnet": "192.168.1.1/24"
    },
    ...
  ]
}`
        }
      ]
    }
  ];

  setActiveSection(id: string): void {
    this.activeSectionId.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  getMethodClass(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): string {
    switch (method) {
      case 'GET': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300';
      case 'POST': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'PUT': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
      case 'DELETE': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
    }
  }
}
