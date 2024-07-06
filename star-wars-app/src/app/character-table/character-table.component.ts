import { Component, OnInit } from '@angular/core';
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
export class CharacterTableComponent implements OnInit {
  isLoading:boolean=true;
  characters: any[] = [];
  paginatedCharacters: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  isAllSelected:boolean=true;
  filters: Filter[] = [
    { label: 'Movie Name', options: [], all: true },
    { label: 'Species', options: [], all: true },
    { label: 'Vehicles', options: [], all: true },
    { label: 'Star Ships', options: [], all: true },
    { label: 'Birth Year', options: [], all: true }
  ];

  constructor(private dataService: DataService,private router:Router) {}

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
      ch.species.map((s: string)=>{
        this.dataService.getSpecie(s).subscribe(data=>{
          ch.species=data.name;
        })
      })
    })
    //movies data
    this.characters.map(ch=>{
      ch.films.map((s: string)=>{
        ch.films=[];
        this.dataService.getFilm(s).subscribe(data=>{
          ch.films.push(data.title);
        })
      })
    })
    //vehicles data
    this.characters.map(ch=>{
      ch.vehicles.map((s: string)=>{
        ch.vehicles=[];
        this.dataService.getVehicle(s).subscribe(data=>{
          ch.vehicles.push(data.name);
        })
      })
    })
    //starship data
    this.characters.map(ch=>{
      ch.starships.map((s: string)=>{
        ch.starships=[];
        this.dataService.getStarship(s).subscribe(data=>{
          ch.starships.push(data.name);
        })
      })
    })
    console.log(this.characters)
    this.paginate(this.characters);
  });
}
optionSelected(filter: Filter) {
  const allSelected = filter.options.every(option => option.selected);
  filter.all = allSelected;
  this.isAnyAllDeselected = !this.filters.every(f => f.all);
}

toggleAll(filter: Filter) {
  filter.options.forEach(option => option.selected = filter.all);
  this.isAnyAllDeselected = !this.filters.every(f => f.all);
}
isAnyAllDeselected = true; 
toggleAll1(filter: Filter) {
  filter.options.forEach(option => option.selected = filter.all);
}

  optionSelected1(filter:any){
    console.log(filter);
    this.isAllSelected=true;
    filter.options.map((opt:any)=>{
      if(opt.selected===false){
        this.isAllSelected=false;
      }
    })
    // this.isAllSelected=filter.selected;
  }
  applyFilters() {
    let filteredCharacters = this.characters;
  
    this.filters.forEach(filter => {
      if (!filter.all) {
        const selectedOptions = filter.options.filter(option => option.selected).map(option => option.label);
        if (selectedOptions.length) {
          filteredCharacters = filteredCharacters.filter(character => {
            if (filter.label === 'Movie Name') {
              return character.films.some((film: any) => selectedOptions.includes(film));
            }
            if (filter.label === 'Species') {
              return character.species.some((specie: any) => selectedOptions.includes(specie));
            }
            if (filter.label === 'Vehicles') {
              return character.vehicles.some((vehicle: any) => selectedOptions.includes(vehicle));
            }
            if (filter.label === 'Star Ships') {
              return character.starships.some((starship: any) => selectedOptions.includes(starship));
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
  
  applyFilters1() {
    let filteredCharacters = this.characters;
  
    this.filters.forEach(filter => {
      if (!filter.all) {
        const selectedOptions = filter.options.filter(option => option.selected).map(option => option.label);
        if (selectedOptions.length) {
          filteredCharacters = filteredCharacters.filter(character => {
            if (filter.label === 'Movie Name') {
              // console.log("inside filter",this.filters[0].options);
              return character.films.some((film: any) => {
                // console.log("film",film)
                const filmTitle = this.filters[0].options.find(o =>{
                  console.log("iniside condition",film+"  "+o.label==film)
                  o.label === film})?.label;
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
