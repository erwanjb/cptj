import Accueil from "./components/pages/Accueil.vue";
import Actualites from "./components/pages/Actualites.vue";
import Press from "./components/pages/Press.vue";
import Contact from "./components/pages/Contact.vue";
import Chronologique from "./components/pages/Chronologique.vue";
import Themes from "./components/pages/Themes.vue";
import Portail from "./components/pages/Portail.vue";
import Apropos from "./components/pages/Apropos.vue";



export const routes = [
	{
		path:"/",
		name:"accueil",
		component:Accueil
	},
	{
		path:"/actualites",
		name:"actualites",
		component:Actualites
	},
	{
		path:"/revue_de_presse",
		name:"revue de presse",
		component:Press
	},
	{
		path:"/contact",
		name:"contact",
		component:Contact
	},
	{
		path:"/apropos",
		name:"à propos",
		component:Apropos
	},
	{
		path:"/chronologique",
		name:"chronologique",
		component:Chronologique
	},
	{
		path:"/themes",
		name:"themes",
		component:Themes
	},
	{
		path:"/portail",
		name:"portail",
		component:Portail
	}
];