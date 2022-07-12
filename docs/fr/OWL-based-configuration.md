_[Accueil](/fr) > Configuration OWL_

# Configurer Sparnatural en OWL

Sparnatural peut être configuré en utilisant un fichier OWL édité dans [Protégé](http://protege.stanford.edu) et sauvegardé au format Turtle.

Sparnatural peut également être configuré au moyen d'une [configuration JSON](/JSON-based-configuration), mais la configuration en OWL permet de s'appuyer sur :
- l'éditeur [Protégé](https://protege.stanford.edu/) ;
- des liens interprétables par une machine entre la configuration de Sparnatural et l'ontologie ;
- le partage, la publication et la réutilisation des configurations ;
- l'hébergement de la configuration sur des serveurs ([acceptant les requêtes CORS](https://enable-cors.org/)) où Sparnatural est installé.

La lecture de cette documentation requiert une connaissance élémentaire de Protégé.

## Ontologies pour la configuration de Sparnatural

Sparnatural est livré avec deux ontologies qui doivent être importées (via owl:imports`) dans votre propre ontologie de configuration :
1. Une ontologie de base : http://data.sparna.fr/ontologies/sparnatural-config-core
2. Une ontologie pour configurer les datasources : http://data.sparna.fr/ontologies/sparnatural-config-datasources

## Comment créer et tester votre propre configuration ?

1. Créez une nouvelle ontologie dans Protégé ;
2. Importez les deux configurations de Sparnatural dans cette ontologie ;
3. Créez votre configuration (voir ci-dessous) ;
4. Enregistrez votre ontologie, de préférence au format Turtle ou RDF/XML mais **pas** dans une sérialisation propre à OWL (comme OWL/XML) ;
5. Configurez une page HTML de test sur le site où Sparnatural est installé (vous pouvez cloner [l'une des pages de démo de Sparnatural](https://github.com/sparna-git/sparnatural.eu)), changez l'URL du service SPARQL à requêter et le lien vers votre fichier de configration.
     1. Vous pouvez tester avec un dépôt GraphDB local, en spécifiant l'URL du dépôt : http://localhost:7200/repositories/{repositoryName}
     1. Si nécessaire (c'est probablement le cas avec la dernière version de GraphDB), assurez-vous que GraphDB accepte les requêtes CORS et soit démarré avec le drapeau **graphdb.workbench.cors.enable** (voir la [documentation GraphDB](https://graphdb.ontotext.com/documentation/standard/workbench-user-interface.html))
6. Pour tester votre configuration en local, entrez le chemin relatif vers le fichier de configuration dans l'initialisation de Javascript et assurez-vous que votre navigateur accepte CORS pour les fichiers locaux.
    1. Pour autoriser CORS avec Firefox :
        1. Ouvrez Firefox
        1. Entrez "about:config" dans la barre d'adresse
        1. Acceptez la modification des préférences
        1. Cherchez la ligne **security.fileuri.strict_origin_policy**
        1. Changez la valeur à "false"
    1. Pour autoriser CORS avec Chrome / Chromium :
        1. Fermez Chrome
        2. Ouvrez un terminal / un utilitaire en ligne de commande
        3. Démarrez Chrome avec le drapeau "**--allow-file-access-from-files**", c'est-à-dire sur Ubuntu Linux "chromium --allow-file-access-from-files"

## Comment publier votre configuration ?

1. Si votre configuration est hébergée sur le même serveur que Sparnatural, il suffit de déposer l'ontologie de configuration dans le même dossier que la page HTML sur laquelle Sparnatural est utilisé.
2. Si votre configuration n'est pas hébergée sur le même serveur que ladite page HTML, celui-ci doit accepter CORS ; pour y remédier simplement, on peut utiliser une dépôt Github ou un Gist ;
3. Spécifiez l'URL de votre ontologie de configuration dans la configuration de Sparnatural. Si le fichier est hébergé sur Github, il s'agit du lien "raw", c'est-à-dire du lien vers le fichier Turtle, e.g. https://raw.githubusercontent.com/sparna-git/Sparnatural/master/demos/sparnatural-demo-semapps/sparnatural-config-semapps-meetup.ttl

## Documentation sur les classes et les propriétés d'une configuration Sparnatural

### Namespaces

| Prefix | Namespaces |
| ------ | ---------- |
| core   | http://data.sparna.fr/ontologies/sparnatural-config-core# |
| ds     | http://data.sparna.fr/ontologies/sparnatural-config-datasources# |

### Documentation sur les classes

| Annotation / Axiom | Label | Card. | Description |
| ------------------ | ----- | ----- | ----------- |
| `rdfs:subClassOf` [`core:SparnaturalClass`](http://data.sparna.fr/ontologies/sparnatural-config-core#SparnaturalClass) | sous-classe d'une propriété Sparnatural | 1..1 | Chaque classe de la configuration doit être déclarée comme sous-classe de `core:SparnaturalClass` |
| `rdfs:label` | affichage du label de la classe | 1..* | Affichage du label de la classe dans la liste de sélection des classes de Sparnatural. Chaque label peut être associé à un code de langue. Sparnatural choisira le label approprié en fonction des paramètres de configuration de langue. Si aucune langue n'est configurée par défaut, Sparnatural choisira un label sans langue associée. |
| [`core:faIcon`](http://data.sparna.fr/ontologies/sparnatural-config-core#faIcon) | code d'icône Fontawesome | 0..1 | Code d'une police Awesome affiché à côté d'un label de classe, e.g. `fas fa-user` ou `fad fa-male`. Si vous utilisez ce paramètre, ne spécifiez pas `core:icon` ou `core:highlightedIcon` |
| [`core:icon`](http://data.sparna.fr/ontologies/sparnatural-config-core#icon) | URL de l'icône | 0..1 | URL d'une icône normale (noire) affichée à côté du label de classe. |
| [`core:highlightedIcon`](http://data.sparna.fr/ontologies/sparnatural-config-core#highlightedIcon) | URL d'une icône mise en surbrillance | 0..1 | URL d'une icône affichée à côté du label de classe et mise en surbrillance au survol. |
| [`core:sparqlString`](http://data.sparna.fr/ontologies/sparnatural-config-core#sparqlString) | Chaîne de caractères pour SPARQL | 0..1 | Chaîne de caractères qui sera insérée dans la requête SPARQL à la place de l'URI de la classe. Sans spécification, c'est l'URI de la classe qui est insérée. N'utilisez pas de préfixes mais des URIs complètes. La chaîne de caractères peut correspondre à n'importe quel segment d'une requête ; il faut donc utiliser `<` et `>`, e.g. `<http://dbpedia.org/ontology/Person>`. Pour restreindre à un ConceptScheme SKOS spécifique, utilisez `skos:Concept; [ skos:inScheme <http://exemple.fr/MyScheme> ]` |
| `rdfs:subClassOf` [`rdfs:Literal`](http://data.sparna.fr/ontologies/sparnatural-config-core/index-en.html#http://www.w3.org/2000/01/rdf-schema#Literal) | sous-classe d'un littéral | 0..1 | Pour les classes qui peuvent correspondre à un littéral (par ex., une date) ou une recherche, définissez-les comme sous-classes de `rdfs:Literal`. 1. Aucun `rdf:type` correspondant à cette classe ne sera inséré dans les requêtes SPARQL 2. La classe n'apparaîtra pas dans la liste initiale des classes 3. il sera impossible de "traverser" cette classe avec des conditions WHERE |
| `rdfs:subClassOf` [`core:NotInstantiatedClass`](http://data.sparna.fr/ontologies/sparnatural-config-core/index-en.html#NotInstantiatedClass) | sous-classe de NotInstantiatedClass | 0..1 | Pour les classes qui se réfèrent à des URIs "externes", non décrites elles-mêmes dans le graphe (i.e. qui ne sont pas sujets d'un triplet du graphe, notamment sans `rdf:type`), définissez la classe comme sous-classe de `core:NotInstantiatedClass`. 1. Aucun `rdf:type` correspondant à cette classe ne sera inséré dans les requêtes SPARQL 2. La classe n'apparaîtra pas dans la liste initiale des classes. Elle pourra toujours être utilisée pour être "traversée" dans une condition WHERE. |
| [`core:order`](http://data.sparna.fr/ontologies/sparnatural-config-datasources#order) | tri | 0..1 | Trier cette classe dans la liste des classes. Sans spécification, c'est l'ordre alphabétique qui est utilisé. |
| [`core:tooltip`](http://data.sparna.fr/ontologies/sparnatural-config-datasources#tooltip) | aide contextuelle | 0..n | Texte qui s'affiche sous forme d'aide contextuelle au survol de la classe, dans les listes ou lorsqu'elle est sélectionnée. Plusieurs valeurs sont possibles selon la langue utilisée. Le balisage HTML est supporté. |

### Documentation sur les propriétés

| Annotation / Axiom | Label | Card. | Description |
| ------------------ | ----- | ----- | ----------- |
| `rdfs:subPropertyOf` | sous-propriété de | 1..1 | Chaque propriété doit avoir une super-propriété correspondant à son type de widget (liste, champ de recherche, sélecteur de date, etc.) Les valeurs types sont [`core:ListProperty`](http://data.sparna.fr/ontologies/sparnatural-config-core#ListProperty) pour une liste, [`core:SearchProperty`](http://data.sparna.fr/ontologies/sparnatural-config-core#SearchProperty) pour un champ de recherche avec autocomplétion, [`core:NonSelectableProperty`](http://data.sparna.fr/ontologies/sparnatural-config-core#NonSelectableProperty) pour un widget sans sélection. Voir [the configuration ontology documentation](http://data.sparna.fr/ontologies/sparnatural-config-core) pour la liste exhaustive des valeurs. |
| `rdfs:label` | affichage du label de la propriété | 1..* | Affichage du label de la propriété dans la liste de sélection des propriétés de Sparnatural. Chaque label peut être associé à un code de langue. Sparnatural choisira le label approprié en fonction des paramètres de configuration de langue. Si aucune langue n'est configurée par défaut, Sparnatural choisira un label sans langue associée. |
| `rdfs:domain` | domain de la propriété | 1..1 | _Domain_ de la propriété, i.e. les classes situées "sur la droite" dans Sparnatural avec lesquelles la propriété peut être utilisée. L'union des classes est supportée, pour les cas où la propriété peut être utilisée avec plusieurs classes (dans Protégé : "Person or Company or Association").|
| `rdfs:range` | range de la propriété | 1..1 | _Range_ de la propriété, i.e. les classes situées "sur la gauche" dans Sparnatural, avec lesquelles la propriété peut être utilisée. L'union des classes est supportée, pour les cas où la propriété peut être utilisée avec plusieurs classes (dans Protégé : "Person or Company or Association"). |
| [`core:sparqlString`](http://data.sparna.fr/ontologies/sparnatural-config-core#sparqlString) | propriété Sparql ou _property path_ | 0..1 | Propriété ou _property path_ insérée à la place de son URI dans la requête SPARQL. Sans spécification, c'est l'URI de la classe qui est insérée. N'utilisez pas de préfixes mais des URIs complètes. La chaîne de caractères peut être n'importe quelle _property path_. Il faut donc utiliser `<` and `>` autour des IRIs, e.g. "`<http://dbpedia.org/ontology/birthPlace>`". Peuvent être utilisés : `^` pour les _inverse path_ `/` pour les _sequence paths_, `(...)` pour les regroupements, `\|` pour les alternatives. Exemples: `<http://dbpedia.org/ontology/author>`, `^<http://dbpedia.org/ontology/museum>` (_reverse path_), `<http://dbpedia.org/ontology/birthPlace>/<http://dbpedia.org/ontology/country>` (_sequence path_), `^(<http://dbpedia.org/ontology/birthPlace>/<http://dbpedia.org/ontology/country>)` (_reverse sequence path_) |
| [`ds:datasource`](http://data.sparna.fr/ontologies/sparnatural-config-datasources#datasource) | propriété de la _datasource_ | 0..1 | Utilisable pour les sous-propriétés de `SelectResourceProperty` (principalement listes et autocomplétion). The datasource to use for the property. La _datasource_ spécifie les modalités d'alimentation de la liste ou les suggestions de l'autocomplétion. Utilisez une _datasource_ "list" pour alimenter une liste ; une _datasource_ "recherche" pour l'autocomplétion. |
| [`core:enableNegation`](http://data.sparna.fr/ontologies/sparnatural-config-core#enableNegation) | autoriser la négation | 0..1 | Active l'option permettant d'exprimer la négation (avec `FILTER NOT EXISTS`) sur cette propriété. `FILTER NOT EXISTS` portera sur la totalité de la "branche" de la requête (c'est-à-dire sur ce critère et tous ses enfants). |
| [`core:enableOptional`](http://data.sparna.fr/ontologies/sparnatural-config-core#enableOptional) | autoriser le critère `OPTIONAL` | 0..1 | Active l'option permettant d'exprimer un `OPTIONAL` sur cette propriété. `OPTIONAL` portera sur la totalité de la "branche" de la requête (c'est-à-dire sur ce critère et tous ses enfants). |
| [`core:isMultilingual`](http://data.sparna.fr/ontologies/sparnatural-config-core#isMultilingual) | **is optional** | 0..1 | Permet d'indiquer que les valeurs de la propriété peuvent être multilingues (en d'autres termes, plusieurs valeurs de langues différentes peuvent être utilisées). Dans ce cas, lorsque la valeur est sélectionnée en colonne, un FILTER sur les valeurs dans la langue par défaut de Sparnatural. |
| [`core:order`](http://data.sparna.fr/ontologies/sparnatural-config-datasources#order) | trier | 0..1 | Position de cette propriété dans la liste des propriétés. Sans spécification, c'est l'ordre alphabétique est utilisé par défaut. |
| [`core:tooltip`](http://data.sparna.fr/ontologies/sparnatural-config-datasources#tooltip) | _tooltip_ | 0..n | Texte affiché sous forme d'aide contextuelle au survol de la propriété dans une liste ou lorsqu'elle est sélectionnée. Ce texte peut être multilingue. Le balisage HTML est possible. |
