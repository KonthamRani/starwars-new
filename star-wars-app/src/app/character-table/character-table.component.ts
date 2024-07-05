import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

interface FilterOption {
  label: string;
  selected: boolean;
}

interface Filter {
  label: string;
  options: FilterOption[];
  all: boolean;
}

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {
  characters: any[] = [];
  paginatedCharacters: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  filters: Filter[] = [
    { label: 'Movie Name', options: [], all: true },
    { label: 'Species', options: [], all: true },
    { label: 'Vehicles', options: [], all: true },
    { label: 'Star Ships', options: [], all: true },
    { label: 'Birth Year', options: [], all: true }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getFilms().subscribe(data => this.filters[0].options = data.results.map((film: any) => ({ label: film.title, selected: false })));
    this.dataService.getSpecies().subscribe(data => this.filters[1].options = data.results.map((specie: any) => ({ label: specie.name, selected: false })));
    this.dataService.getVehicles().subscribe(data => this.filters[2].options = data.results.map((vehicle: any) => ({ label: vehicle.name, selected: false })));
    this.dataService.getStarships().subscribe(data => this.filters[3].options = data.results.map((starship: any) => ({ label: starship.name, selected: false })));
    this.dataService.getPeople().subscribe(data => {
      this.characters = data.results;

      // Extract the birth years from the list of characters
      const birthYears = data.results.map((character: any) => character.birth_year);

      // Create a Set to filter out unique birth years
      const uniqueBirthYears = Array.from(new Set(birthYears));

      // Map the unique birth years to the desired format
      const birthYearOptions = uniqueBirthYears.map(year => ({ label: String(year), selected: false }));

      // Assign the formatted birth years to the appropriate filter
      this.filters[4].options = birthYearOptions;

      this.paginate(this.characters);  // Initialize with all characters
    });
  }

  toggleAll(filter: Filter) {
    filter.options.forEach(option => option.selected = filter.all);
  }

  applyFilters() {
    let filteredCharacters = this.characters;
  
    this.filters.forEach(filter => {
      if (!filter.all) {
        const selectedOptions = filter.options.filter(option => option.selected).map(option => option.label);
        if (selectedOptions.length) {
          filteredCharacters = filteredCharacters.filter(character => {
            if (filter.label === 'Movie Name') {
              return character.films.some((film: any) => {
                const filmTitle = this.filters[0].options.find(o => o.label === film)?.label;
                return filmTitle ? selectedOptions.includes(filmTitle) : false;
              });
            }
            if (filter.label === 'Species') {
              return character.species.some((specie: any) => {
                const specieName = this.filters[1].options.find(o => o.label === specie)?.label;
                return specieName ? selectedOptions.includes(specieName) : false;
              });
            }
            if (filter.label === 'Vehicles') {
              return character.vehicles.some((vehicle: any) => {
                const vehicleName = this.filters[2].options.find(o => o.label === vehicle)?.label;
                return vehicleName ? selectedOptions.includes(vehicleName) : false;
              });
            }
            if (filter.label === 'Star Ships') {
              return character.starships.some((starship: any) => {
                const starshipName = this.filters[3].options.find(o => o.label === starship)?.label;
                return starshipName ? selectedOptions.includes(starshipName) : false;
              });
            }
            if (filter.label === 'Birth Year') {
              return selectedOptions.includes(character.birth_year);
            }
            return false;
          });
        }
      }
    });
  
    this.paginate(filteredCharacters);
  }
  

  paginate(characters: any[]) {
    this.totalPages = Math.ceil(characters.length / this.pageSize);
    this.currentPage = 0;  // Reset to the first page
    this.paginatedCharacters = characters.slice(0, this.pageSize);
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.paginatedCharacters = this.characters.slice(page * this.pageSize, (page + 1) * this.pageSize);
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
