import { Component, OnInit, ViewChild } from '@angular/core';
import { Covid19ApiService } from '../covid19-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { CountrySummary } from '../../countrySummary';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  isLoading = true;
  isMobile: boolean;
  observerSubscription: Subscription;
  summary: CountrySummary[];
  // displayedColumns: string[] = [
  //   'Country',
  //   'TotalConfirmed',
  //   'TotalDeaths',
  //   'TotalRecovered',
  // ];
  displayedColumns: string[];
  dataSource = new MatTableDataSource<CountrySummary>(this.summary);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private covid19ApiSrv: Covid19ApiService,
    breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {
    this.observerSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
        if (this.isMobile) {
          this.displayedColumns = [
            'Country',
            'TotalConfirmed',
            'NewConfirmed',
            'TotalDeaths',
            'NewDeaths',
            'TotalRecovered',
            'NewRecovered',
            'Date',
          ];
        } else {
          this.displayedColumns = [
            'Country',
            'TotalConfirmed',
            'TotalDeaths',
            'TotalRecovered',
          ];
        }
      });
  }

  openDialog(message) {
    this.dialog.open(DialogComponent, {
      data: {
        message: message,
      },
    });
  }
  ngOnInit(): void {
    this.getAllSummary();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllSummary() {
    this.covid19ApiSrv.getSummary().subscribe(
      (data) => {
        this.dataSource.data = data['Countries'] as CountrySummary[];
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.openDialog(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
