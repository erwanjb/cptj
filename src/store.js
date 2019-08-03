import axios from 'axios'
import Vue from "vue";
import Vuex from "vuex"


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    	categorie: [],
    	categoriebis: [],
    	nb: [],
    	tab: [],
        tabTotal: [],
    	tabA:[],
    	apropos: null,
    	projets: []
    },
    mutations: {
    	fillCategorie(state, newCat){
    		state.categorie = newCat
    	},
    	fillCategorieBis(state) {
    		for(let i= 0;i<state.categorie.length;i++){
				let stock ="";
				for(let j=0;j<state.categorie[i].length;j++){
					if(state.categorie[i][j]=="_"||state.categorie[i][j]=="\\"){
						if(state.categorie[i][j]=="_"){
							stock+=" ";
						}
						if(state.categorie[i][j]=="\\"){
							stock+="";
						}

					}else{
						stock+=state.categorie[i][j];
					}
				}
				state.categoriebis[i]=stock;
			}
    	},
    	fillNb(state, newNb){
    		state.nb = newNb
    	},
    	fillTab(state, newTab){
    		state.tab = newTab
    	},
        fillTabTotal(state, newTabT){
            state.tabTotal = newTabT
        },
    	fillTabA(state, newTab){
    		state.tabA = newTab
    	},
    	fillApropos(state, newApropos){
    		state.apropos = newApropos
    	},
    	fillProjet(state, newProjet){
    		state.projets = newProjet
    	}
    },
    actions: {
    	importTheme(context){
	    	axios({
				method :"get",
				url :"/themes"
			})
			.then(res =>{
				context.commit('fillCategorie', res.data.categorie)
				context.commit('fillCategorieBis')
				context.commit('fillTab', res.data.tab)
                context.commit('fillTabTotal', res.data.tabTotal)
				if(!context.state.nb.length){
					context.commit('fillNb', res.data.nb)
				}
			});
    	},
    	importActu(context){
    		axios({
				method:"get",
				url:"/actualite"
			})
			.then(res=>{
				context.commit('fillTabA', res.data)
			});
    	},
    	importApropos(context){
    		axios({
				method:"get",
				url:"/apropos"
			})
			.then(res=>{
				context.commit('fillApropos', res.data)
			});
    	},
    	importProjet(context){
    		axios({
				method:"get",
				url:"/projet"
			})
			.then(res=>{
				context.commit('fillProjet', res.data)
			});
    	}
    },
    getters: {}
})
