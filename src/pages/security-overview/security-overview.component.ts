import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { IconComponent } from '../../components/icon/icon.component';
import { EventLogsViewComponent } from './components/event-logs-view/event-logs-view.component';
import { SignaturesViewComponent } from './components/signatures-view/signatures-view.component';
import { SettingsViewComponent } from './components/settings-view/settings-view.component';

// Data types for the page
interface SecurityStat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-security-overview',
  imports: [CommonModule, FormsModule, IconComponent, EventLogsViewComponent, SignaturesViewComponent, SettingsViewComponent],
  templateUrl: './security-overview.component.html',
  styleUrls: ['./security-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityOverviewComponent implements AfterViewInit, OnInit {
  // ViewChild for D3 charts
  donutChartContainer = viewChild<ElementRef>('donutChartContainer');
  lineChartContainer = viewChild<ElementRef>('lineChartContainer');

  // Page state
  activeTab = signal<'overview' | 'logs' | 'signatures' | 'settings'>('overview');
  isHubEnabled = signal(true);
  isInfoVisible = signal(false);
  
  tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'logs', name: 'Event Logs' },
    { id: 'signatures', name: 'Signatures' },
    { id: 'settings', name: 'Settings' }
  ];

  stats = signal<SecurityStat[]>([
    { title: 'Threats Blocked (24h)', value: '1,428', icon: 'fas fa-ban', color: 'text-red-500' },
    { title: 'Signatures Active', value: '12,540', icon: 'fas fa-fingerprint', color: 'text-blue-500' },
    { title: 'Critical Alerts', value: '12', icon: 'fas fa-exclamation-triangle', color: 'text-yellow-500' },
    { title: 'Security Policies', value: '8', icon: 'fas fa-file-shield', color: 'text-green-500' },
  ]);

  ngOnInit(): void {
    if (localStorage.getItem('securityHubInfoDismissed') !== 'true') {
      this.isInfoVisible.set(true);
    }
  }

  ngAfterViewInit(): void {
    // The charts are only on the overview tab, so we need to ensure they are drawn
    // when the component initializes (as overview is the default tab).
    // A more robust solution might use an effect that triggers on tab change.
    setTimeout(() => {
        if(this.activeTab() === 'overview') {
            this.drawDonutChart();
            this.drawLineChart();
        }
    }, 50);
  }
  
  dismissInfo(): void {
    this.isInfoVisible.set(false);
    localStorage.setItem('securityHubInfoDismissed', 'true');
  }

  setActiveTab(tabId: 'overview' | 'logs' | 'signatures' | 'settings'): void {
    this.activeTab.set(tabId);
     if (tabId === 'overview') {
      // Redraw charts when switching back to the overview tab
      setTimeout(() => {
        this.drawDonutChart();
        this.drawLineChart();
      }, 50);
    }
  }

  private drawDonutChart(): void {
    const data = [
        { severity: 'Critical', value: 12, color: '#EF4444' },
        { severity: 'High', value: 78, color: '#F97316' },
        { severity: 'Medium', value: 215, color: '#F59E0B' },
        { severity: 'Low', value: 1123, color: '#3B82F6' }
    ];

    const element = this.donutChartContainer()?.nativeElement;
    if (!element) return;

    const width = 250;
    const height = 250;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;
    
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<{ value: number }>().value(d => d.value).sort(null);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
    
    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');
  }

  private drawLineChart(): void {
    const data = [
        { date: d3.timeDay.offset(new Date(), -6), value: 350 },
        { date: d3.timeDay.offset(new Date(), -5), value: 420 },
        { date: d3.timeDay.offset(new Date(), -4), value: 280 },
        { date: d3.timeDay.offset(new Date(), -3), value: 550 },
        { date: d3.timeDay.offset(new Date(), -2), value: 480 },
        { date: d3.timeDay.offset(new Date(), -1), value: 690 },
        { date: new Date(), value: 1428 }
    ];

    const element = this.lineChartContainer()?.nativeElement;
    if (!element) return;
    
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
      
    const isDarkMode = document.documentElement.classList.contains('dark');
    const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
    const borderColor = isDarkMode ? '#475569' : '#e2e8f0';

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%a')));
    
    xAxisGroup.selectAll('.domain, .tick line').attr('stroke', borderColor);
    xAxisGroup.selectAll('.tick text').attr('fill', axisColor).style('font-size', '10px');

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([height, 0]);
    const yAxisGroup = svg.append('g').call(d3.axisLeft(y));
    
    yAxisGroup.selectAll('.domain, .tick line').attr('stroke', borderColor);
    yAxisGroup.selectAll('.tick text').attr('fill', axisColor).style('font-size', '10px');
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#679a41')
      .attr('stroke-width', 2)
      .attr('d', d3.line<{date: Date, value: number}>()
        .x(d => x(d.date))
        .y(d => y(d.value))
      );
  }
}