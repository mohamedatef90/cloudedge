import { Injectable, signal } from '@angular/core';

// Interfaces from community-forum.component.ts
export interface ForumTopic {
  id: string;
  title: string;
  author: { name: string; avatar: string; };
  replies: number;
  views: number;
  lastActivity: { author: { name: string; avatar: string; }; time: string; };
  isPinned?: boolean;
  content?: string; // Add content for the topic page
  comments?: ForumComment[]; // Add comments
}

export interface ForumComment {
  id: string;
  author: { name: string; avatar: string; role?: string; };
  time: string;
  content: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: ForumTopic[];
}

const MOCK_CATEGORIES: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'Chat about anything related to CloudEdge and cloud computing.',
      icon: 'fas fa-comments',
      topics: [
        {
            id: 't1',
            title: 'Welcome to the new CloudEdge Community!',
            author: { name: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
            replies: 15, views: 2300,
            lastActivity: { author: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=customer' }, time: '2h ago' },
            isPinned: true,
            content: `<p>We're thrilled to launch the official CloudEdge Community Forum! This is the place to ask questions, share your projects, and connect with other developers and cloud enthusiasts.</p><p>To get started, introduce yourself in this thread. We can't wait to see what you build!</p>`,
            comments: [
                { id: 'c1', author: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=customer' }, time: '2h ago', content: `<p>This is great! Happy to be here.</p>` },
                { id: 'c2', author: { name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam' }, time: '1h ago', content: `<p>Awesome! Looking forward to learning from everyone.</p>` },
            ]
        },
        {
            id: 't2',
            title: 'What are you building with CloudEdge?',
            author: { name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam' },
            replies: 42, views: 5600,
            lastActivity: { author: { name: 'Chris', avatar: 'https://i.pravatar.cc/150?u=chris' }, time: '5h ago' },
            content: `<p>Curious to see the cool projects everyone is working on. I'm currently migrating a legacy monolith application to a microservices architecture on CloudEdge VMs.</p><p>What about you?</p>`,
            comments: [
                { id: 'c3', author: { name: 'Chris', avatar: 'https://i.pravatar.cc/150?u=chris' }, time: '5h ago', content: `<p>I'm building a real-time analytics dashboard. Using a combination of VMs for data processing and storage.</p>` },
            ]
        },
      ]
    },
    {
      id: 'vms',
      name: 'Virtual Machines',
      description: 'Questions and discussions about managing VMs, OS images, and performance.',
      icon: 'fas fa-desktop',
      topics: [
        {
            id: 't3',
            title: 'Best practices for securing a new Ubuntu VM?',
            author: { name: 'Maria', avatar: 'https://i.pravatar.cc/150?u=maria' },
            replies: 8, views: 1200,
            lastActivity: { author: { name: 'David', avatar: 'https://i.pravatar.cc/150?u=david' }, time: '1d ago' },
            content: `<p>Just spun up a new Ubuntu 22.04 server. What are the first things I should do to secure it? I've already configured the firewall, but I'm wondering about things like fail2ban, SSH key authentication, etc.</p>`,
            comments: [
                 { id: 'c4', author: { name: 'David', avatar: 'https://i.pravatar.cc/150?u=david', role: 'Cloud Expert' }, time: '1d ago', content: `<p>Great question, Maria! Disabling password authentication for SSH and only using keys is a huge security win. Also, make sure you set up automatic security updates. Here's a good guide: <code>apt-get install unattended-upgrades</code></p>` },
            ]
        },
        {
            id: 't4',
            title: 'VM stuck in "provisioning" state',
            author: { name: 'John', avatar: 'https://i.pravatar.cc/150?u=john' },
            replies: 3, views: 450,
            lastActivity: { author: { name: 'SupportTeam', avatar: 'https://i.pravatar.cc/150?u=support' }, time: '1d ago' },
            content: `<p>I tried to create a new Windows Server VM about 20 minutes ago and it's still showing as "provisioning" in the dashboard. Is this normal?</p>`,
            comments: [
                { id: 'c5', author: { name: 'SupportTeam', avatar: 'https://i.pravatar.cc/150?u=support', role: 'Support' }, time: '1d ago', content: `<p>Hi John, sorry for the trouble. We saw a brief delay in our provisioning queue. It should be resolved now. Can you please check again?</p>` },
            ]
        },
      ]
    },
    {
      id: 'networking',
      name: 'Networking',
      description: 'All about Gateways, NAT, Firewalls, and private networking.',
      icon: 'fas fa-network-wired',
      topics: [
        {
            id: 't5',
            title: 'How to configure a NAT rule for a web server?',
            author: { name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' },
            replies: 5, views: 980,
            lastActivity: { author: { name: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, time: '3d ago' },
            content: `<p>I have a web server running on a private IP (192.168.1.10) and I've reserved a public IP. How do I create a DNAT rule to forward traffic from the public IP on port 443 to my internal server?</p>`,
            comments: []
        },
      ]
    },
    {
      id: 'feature-requests',
      name: 'Feature Requests',
      description: 'Have an idea for a new feature? Share it here!',
      icon: 'fas fa-lightbulb',
      topics: [
        {
            id: 't6',
            title: 'Request: Dark mode for the dashboard',
            author: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=customer' },
            replies: 28, views: 3100,
            lastActivity: { author: { name: 'CloudEdgeDev', avatar: 'https://i.pravatar.cc/150?u=dev' }, time: '6h ago' },
            content: `<p>It would be great to have a native dark mode for the CloudEdge dashboard. It would be much easier on the eyes, especially for those of us working late at night!</p>`,
            comments: []
        },
      ]
    }
  ];


@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private categories = signal<ForumCategory[]>(MOCK_CATEGORIES);

  getCategories() {
    return this.categories.asReadonly();
  }

  getTopicById(topicId: string): { topic: ForumTopic; category: ForumCategory } | undefined {
    for (const category of this.categories()) {
      const topic = category.topics.find(t => t.id === topicId);
      if (topic) {
        return { topic, category };
      }
    }
    return undefined;
  }
}
