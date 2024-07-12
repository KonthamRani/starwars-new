import { Component, OnInit , DoCheck} from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

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
export class CharacterTableComponent implements OnInit,DoCheck {
  isLoading:boolean=true;
  characters: any[] = [];
  paginatedCharacters: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  isAllSelected:boolean=true;//no need
  filters: Filter[] = [
    { label: 'Movie Name', options: [], all: true },
    { label: 'Species', options: [], all: true },
    { label: 'Vehicles', options: [], all: true },
    { label: 'Star Ships', options: [], all: true },
    { label: 'Birth Year', options: [], all: true }
  ];

  constructor(private dataService: DataService,private router:Router) {}
  ngDoCheck(): void {
      console.log("ngDoCheck is called");
  }

  ngOnInit() {
    this.getFilmsData();
    this.getSpeciesData();
    this.getVehiclesData();
    this.getStarShipsData();
    this.getPeopleData();    
  }
getFilmsData(){
  this.isLoading=true;
  this.dataService.getFilms().subscribe(
    data =>{
      this.isLoading=false;
      this.filters[0].options = data.results.map((film: any) => ({ label: film.title, selected: true }))
    },
    error=>{
      this.isLoading=false;
      console.log("getFilmsData",error)
    }
    );
}
getSpeciesData(){
  this.isLoading=true;
  this.dataService.getSpecies().subscribe(data =>
    {
      this.isLoading=false;
     this.filters[1].options = data.results.map((specie: any) => ({ label: specie.name, selected: true }))
    },
     error=>{
      this.isLoading=false;
      console.log("getSpeciesData",error)
     }
     )

}
getVehiclesData(){
  this.isLoading=true;
  this.dataService.getVehicles().subscribe(data =>
    {
      this.isLoading=false;
      this.filters[2].options = data.results.map((vehicle: any) => ({ label: vehicle.name, selected: true }))
    console.log(this.filters[2].options);
    },
    error=>{
      this.isLoading=false;
     console.log("getVehiclesData",error)
    }
     
     );
    
}
getStarShipsData(){
  this.isLoading=true;
  this.dataService.getStarships().subscribe(data => 
    {
      this.filters[3].options = data.results.map((starship: any) => ({ label: starship.name, selected: true }))
      this.isLoading=false;
    },
     error=>{
      this.isLoading=false;
      console.log("getStarShipsData",error)
     }
    );
    
}
getPeopleData(){
  this.isLoading=true;
  this.dataService.getPeople().subscribe(data => {
    this.isLoading=false;
    this.characters = data.results;
    const birthYears = data.results.map((character: any) => character.birth_year);
    const uniqueBirthYears = Array.from(new Set(birthYears));
    const birthYearOptions = uniqueBirthYears.map(year => ({ label: String(year), selected: true }));
    this.filters[4].options = birthYearOptions;
    //species data
    this.characters.map(ch=>{
      this.isLoading=true;
      ch.species.map((s: string)=>{
        this.dataService.getSpecie(s).subscribe(data=>{
          ch.species=data.name;
          this.isLoading=false;
        },
        error=>{
          this.isLoading=false;
          console.log("getSpecie",error)
        })
      })
    })
    //movies data
    this.characters.map(ch=>{
      this.isLoading=true;
      ch.films.map((s: string)=>{
        ch.films=[];
        this.dataService.getFilm(s).subscribe(data=>{
          ch.films.push(data.title);
          this.isLoading=false;
        },
        error=>{
          this.isLoading=false;
          console.log("getFilm",error)
        })
      })
    })
    //vehicles data
    this.characters.map(ch=>{
      this.isLoading=true;
      ch.vehicles.map((s: string)=>{
        ch.vehicles=[];
        this.dataService.getVehicle(s).subscribe(data=>{
          ch.vehicles.push(data.name);
          this.isLoading=false;
        },
        error=>{
          this.isLoading=false;
          console.log("getVehicle",error)
        }
      )
      })
    })
    //starship data
    this.characters.map(ch=>{
      this.isLoading=true;
      ch.starships.map((s: string)=>{
        ch.starships=[];
        this.dataService.getStarship(s).subscribe(data=>{
          ch.starships.push(data.name);
          this.isLoading=false;
        },
       error=>{
        this.isLoading=false;
        console.log("getStarship",error)
      })
      })
    })
    this.paginate(this.characters);
  },
  error=>{
    this.isLoading=false;
    console.log("getPeople",error)
  }
)
  
}
optionSelected(filter: Filter) {
  const allSelected = filter.options.every(option => option.selected);
  filter.all = allSelected;
}

toggleAll(filter: Filter) {
  console.log(filter);
  filter.options.forEach(option => option.selected = filter.all);
}
  applyFilters() {
    console.log('applyFilters called');
    let filteredCharacters = this.characters;
  
    this.filters.forEach(filter => {
      console.log(filter)
      if (!filter.all) {
        const selectedOptions = filter.options.filter(option => option.selected).map(option => option.label);
        console.log(selectedOptions)
        if (selectedOptions.length) {
          console.log(`selectedOptions for ${filter.label}:`, selectedOptions);
          filteredCharacters = filteredCharacters.filter(character => {
            console.log(character)
            if (filter.label === 'Movie Name') {
              return character.films.some((film: string) => selectedOptions.includes(film));
            }
            if (filter.label === 'Species') {
              return selectedOptions.includes(character.species);
            }
            if (filter.label === 'Vehicles') {
              return character.vehicles.some((vehicle: string) => selectedOptions.includes(vehicle));
            }
            if (filter.label === 'Star Ships') {
              return character.starships.some((starship: string) => selectedOptions.includes(starship));
            }
            if (filter.label === 'Birth Year') {
              return selectedOptions.includes(character.birth_year);
            }
            return false;
          });
          console.log(`filteredCharacters after ${filter.label} filter:`, filteredCharacters);
        }
      }
    });
  
    this.paginate(filteredCharacters);
    console.log('paginate called with characters:', filteredCharacters);
  }

  

filteredCharacters: any[] = []; 
paginate(characters: any[]) {
  this.filteredCharacters = characters;  
  this.totalPages = Math.ceil(characters.length / this.pageSize);
  this.currentPage = 0;  
  this.paginatedCharacters = characters.slice(0, this.pageSize);
  console.log("Filtered and paginated characters:", this.paginatedCharacters);
}

changePage(page: number) {
  if (page >= 0 && page < this.totalPages) {
    this.currentPage = page;
    this.paginatedCharacters = this.filteredCharacters.slice(page * this.pageSize, (page + 1) * this.pageSize);
    console.log("Paginated characters for page:", this.currentPage, this.paginatedCharacters);
  }
}

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  goToDetails(id:any){
    console.log("goToDetails "+id)
    this.router.navigate(['character/'+id]);
  }
  getSpecieData(url: any): Observable<string> {
    return this.dataService.getSpecie(url).pipe(
      map(data => data.name)
    );
  }

}
