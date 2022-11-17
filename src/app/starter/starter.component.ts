import { ActivatedRoute } from '@angular/router';
import { IStats } from './interface';
import { starterService } from './starter.service';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './starter.component.html',
})
export class StarterComponent implements AfterViewInit {
  subtitle: String;
  public stats: IStats;
  public config: any;

  constructor(
    private staterSerive: starterService,
    private route: ActivatedRoute
  ) {
    this.subtitle = 'Quick analytics';
    this.config = this.route.snapshot.data['appConfig'];
    this.stats = {
      totalStudents: 56,
      totalTutors: 16,
      totalTutorPendingApproved: 14,
      payoutRequestPending: 23,
      totalWebinars: 7,
      totalRevenue: 1256,
    };
  }
  ngOnInit() {}
  ngAfterViewInit() {}
}
