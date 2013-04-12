## Site internet de la Compagnie Aorte.

Ce site est conçu en Single Page Application : toutes les informations sont chargées lors de l'ouverture du site, ensuite c'est simplement javascript qui gère le contenu.

# Hébergement

Il est hébergé par [Google App Engine](https://appengine.google.com). Il faut installer le client pour pouvoir faire tourner le site en local, et envoyer les mises à jour sur le Web. Seb sait faire.

# Structure

Toutes les pages de contenu sont de type `section`, de classe ̀content`, avec l'id qui correspond à ce qui sera dans la barre d'adresse `/#!compagnie` :

```html
<section id="compagnie" class="content">
	<!-- page compagnie -->
</section>
```

Une exception pour les photos, dans ce cas, les photos sont chargées au moment où la page des photos est demandée. C'est l'attribut `lazy` qui détermine cela, la source de l'image est alors stockée dans `src-lazy`, puis copiée dans `src` au moment où la page est appellée : 

```html
<section id="photos-ours" class="content photos lazy" style="display: block;">
	<h2>L'ours</h2>
	<ul>
		<li>
			<img class="thumb" src-lazy="spectacles/ours/photos/001.jpg" title="Avignon 2012">
		</li>
		<li>
			<img class="thumb" src-lazy="spectacles/ours/photos/002.jpg" title="Avignon 2012">
		</li>
	</ul>
</section>
```

La navigation se fait grâce à des `link`s virtuels. 

```js
$(document).on('click', '.link', showContent);
```

```html
<div data-link="photos" class="link">Photos</div>
```

`showContent` lis le `data-link` et met à jour la `<section>` en cours.

# Données

De nombreuses données sont chargées en JSON, pour une maintenance plus facile, pour un non-informaticien. Tous les fichiers json se trouvent dans le dossier du même nom. Il faut s'assurer de bien maintenir la structure des fichiers json pour y faire des modifications. Autrement, il est possible que plus rien ne fonctionne.

Elles sont chargées par `myGetJSON` et ajoutées au DOM par les fonctions `appendXXXX`.

# Menu

Pour ajouter des entrées au menu, il faut respecter la hiérarchie suivante :

```html
<li class="menu_list"> <!-- Menu niveau 1 -->
	<div data-link="en_ce_moment" class="link">En ce moment</div>
</li>

<li class="menu_list"> 
	<div>Les amuses-bouches</div>
	<ul class="sub_menu"> <!-- Menu niveau 2 -->
		<li class="menu_sublist"><div data-link="photos" class="link"><span class="white-bg">Photos</span></div></li>
		<li class="menu_sublist"><div data-link="videos" class="link"><span class="white-bg">Vidéos</span></div></li>
	</ul>
</li>
```

**A noter que le menu spectacle est généré automatiquement dans le fichier `spectacles.json`.**

