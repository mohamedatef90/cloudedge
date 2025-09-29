import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import * as d3 from 'd3';
import { BillingData } from '../../dashboard.types';

@Component({
  selector: 'app-billing-summary',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingSummaryComponent implements OnChanges {
  billingData = input.required<BillingData>();
  chartContainer = viewChild<ElementRef>('chartContainer');

  ngOnChanges(changes: SimpleChanges): void {
    if (this.billingData() && this.chartContainer()) {
      setTimeout(() => this.createDonutChart(this.billingData().breakdown), 0);
    }
  }

  private createDonutChart(data: { service: string; cost: number; color: string }[]): void {
    const element = this.chartContainer()!.nativeElement;
    if (!element || element.clientWidth === 0) {
        return;
    }
    const width = 140;
    const height = 140;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<{ cost: number }>().value(d => d.cost).sort(null);
    const data_ready = pie(data);

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => data[i].color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');
  }
}
