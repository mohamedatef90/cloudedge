import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild, output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import * as d3 from 'd3';
import { StatCard } from '../../dashboard.types';

@Component({
  selector: 'app-stat-chart-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './stat-chart-modal.component.html',
  styleUrls: ['./stat-chart-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatChartModalComponent implements OnChanges {
  isOpen = input.required<boolean>();
  statData = input<StatCard | null>();
  
  close = output<void>();

  chartContainer = viewChild<ElementRef>('chartContainer');
  activeTimeframe = signal<'1H' | '24H' | '7D'>('24H');
  
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['isOpen'] && this.isOpen()) {
          // timeout to allow element to be rendered
          setTimeout(() => this.drawChart(), 50);
      }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  setTimeframe(tf: '1H' | '24H' | '7D'): void {
      this.activeTimeframe.set(tf);
      this.drawChart();
  }

  private drawChart(): void {
    const stat = this.statData();
    if (!stat || !stat.historicalData || !this.chartContainer()) {
      return;
    }

    const data = this.filterDataByTimeframe(stat.historicalData, this.activeTimeframe());
    
    const element = this.chartContainer()!.nativeElement;
    if (!element || element.clientWidth === 0) {
        return;
    }
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.time) as [Date, Date])
      .range([0, width]);
      
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    const yMax = stat.title === 'Active VMs' ? stat.total : 100;
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);
      
    svg.append('g')
      .call(d3.axisLeft(y));

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "currentColor")
        .text(stat.title === 'Active VMs' ? 'VM Count' : 'Utilization (%)');

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#679a41')
      .attr('stroke-width', 2.5)
      .attr('d', d3.line<{time: Date, value: number}>()
        .x(d => x(d.time))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX)
      );
  }
  
  private filterDataByTimeframe(data: {time: Date, value: number}[], timeframe: '1H' | '24H' | '7D') {
      const now = new Date();
      let startTime = new Date();
      switch (timeframe) {
          case '1H': startTime.setHours(now.getHours() - 1); break;
          case '24H': startTime.setDate(now.getDate() - 1); break;
          case '7D': startTime.setDate(now.getDate() - 7); break;
      }
      return data.filter(d => new Date(d.time) >= startTime);
  }
}
