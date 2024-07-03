import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Film, Species, Starship, Vehicle } from './character-table';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css'],
})
export class CharacterTableComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'name', 'species', 'birthYear'];
  dataSource = new MatTableDataSource<any>();
  totalCharacters = 0;
  currentPage = 0;
  pageSize = 5;  // Set your desired page size here
  filters: any = {
    movieName: { all: true },
    species: { all: true },
    vehicles: { all: true },
    starships: { all: true },
    birthYear: { all: true },
  };
  films:Film[] = [];
  species :Species[] = [];
  starships:Starship[]=[];
  vehicles:Vehicle[]=[];
  birthYear:any[]=[];
  // Variable to hold the fetched data
  fetchedData: any[] = [];

  constructor(private dataService: DataService,private router:Router) {}

  ngOnInit() {
    this.dataService.getFilms().subscribe((data) => (this.films = data.results));
    this.dataService.getSpecies().subscribe((data) => (this.species = data.results));
    this.dataService.getVehicles().subscribe((data) => (this.vehicles = data.results));
    this.dataService.getStarships().subscribe((data) => (this.starships = data.results));
    this.dataService.getPeople().subscribe((data) => (this.birthYear = data.results.map((person: { birth_year: any; }) => person.birth_year)));
    this.loadCharacters();  // Load characters only once when component initializes
  }

  @Input() set filterValues(filters: any) {
    this.filters = filters;
    this.currentPage = 0;
    // Apply filters to already fetched data and update table
    this.dataSource.data = this.applyFilters(this.fetchedData);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    // Update table with paginated data from already fetched data
    this.dataSource.data = this.paginate(this.fetchedData, this.currentPage, this.pageSize);
  }

  loadCharacters() {
    this.dataService.getPeople().subscribe((data) => {
      this.fetchedData = data.results;  // Store fetched data locally
      this.totalCharacters = this.fetchedData.length;
      this.dataSource.data = this.paginate(this.fetchedData, this.currentPage, this.pageSize);
      console.log(this.dataSource);
      this.fetchedData.forEach((character, index) => {
        if (character.species.length > 0) {
          console.log(character.species);
          this.dataService.getSpeciesData(character.species[0]).subscribe(speciesData => {
            // Assuming speciesData contains the name of the species
            this.fetchedData[index].species = speciesData.name;
          });
        } else {
          // Handle case where species array is empty or species data is not available
          this.fetchedData[index].species = '---';
        }
      });
    });
  }

  applyFilters(data: any[]) {
    let filteredData = data;
    console.log("filteredData",data);
    if (this.filters.movieName && !this.filters.movieName.all) {
      filteredData = filteredData.filter((character) =>
        this.filters.movieName[character.films]
      );
    }

    if (this.filters.species && !this.filters.species.all) {
      filteredData = filteredData.filter((character) =>{
        this.filters.species[character.species];
        console.log(this.filters.species[character.species]);
      }
      );
    }
   


    // Similarly apply other filters

    return filteredData;
  }

  paginate(array: any[], page: number, pageSize: number): any[] {
    const startIndex = page * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }
  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
  goToDetails(id:any){
    console.log("goToDetails "+id)
    this.router.navigate(['character/'+id]);
  }
  search(){
    alert("need to implement")
  }
}
