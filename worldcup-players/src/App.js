import React, { Component } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import Player from './Player';
import Question from './Question';
import Answer from './Answer';
import PlayersDb from './data/data.json';
import Masthead from '@ta-interaktiv/react-masthead'
import Scoreboard from './Scoreboard';
import Inlinescore from './Inlinescore';
import Pronocard from './Pronocard';
import GoalAnimation from './GoalAnimation';

import { displayTypes } from '@ta-interaktiv/react-share-buttons'
import FeedbackMessage from '@ta-interaktiv/react-feedback-message'
import PolymorphicShareButtons from '@ta-interaktiv/react-polymorphic-share-buttons'
import { TimestampFormatter } from '@ta-interaktiv/react-publication-info'

import '@ta-interaktiv/semantic-ui/semantic/dist/components/reset.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/site.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/segment.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/grid.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/table.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/header.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/divider.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/image.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/rail.css'

import './App.css';


const questions = [
  {
    "title": "Quelle est votre taille?",
    "answers": ["On dit que je suis petit", "Comme les autres", "On me surnomme la perche"]
  },{
    "title": "Quel est votre poids?",
    "answers": ["Poids plume", "Juste ce qu'il faut", "J'aime la raclette"]
  },{
    "title": "On vous bouscule dans la rue, que faites-vous?",
    "answers": ["Sur de ma force, je continue comme si de rien", "Je m'arrête et fais une remarque", "je pousse l'autre immédiatement"],
    "videoAnswers": ["https://media.giphy.com/media/3o7aDcRturpZG7Cxbi/giphy.gif", "https://media.giphy.com/media/A7Wi3pid1U5iVQ696I/giphy.gif","https://media.giphy.com/media/kuf7g0KM5UMBW/giphy.gif"]
  },{
    "title": "Êtes-vous droitier ou gaucher?",
    "answers": ["Gaucher", "Droitier"]
  },{
    "title": "Dans la vie, vous pensez que...",
    "answers": ["Il ne faut rien laisser passer", "La meilleure attaque c'est la défense", "Il faut trouver le juste milieu", "Il faut toujours aller de l'avant"]
  },{
    "title": "Voyagez vous régulièrement ?",
    "answers": ["Dès que j'ai 500 francs sur mon compte", "Seulement pendant les vacances"]
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTemplate: 0,
      answers: new Array(questions.length).fill(null),
      matchedPlayer: null
    };
    this.answeredHandler = this.answeredHandler.bind(this);
    this.setNextTemplate = this.setNextTemplate.bind(this);
    this.start = this.start.bind(this);
    this.questionComponents = []
  }

  start(){
    setTimeout(() => {scrollToComponent(this.questionComponents[0])}, 250)
  }

  setNextTemplate(){
    this.setState({"currentTemplate": (this.state.currentTemplate + 1) % 7})
  }

  gotoNextQuestion(id){
    let nextQuestionId = (id+1) % questions.length
    let anchor = this.questionComponents[nextQuestionId]

    // If all the questions have been answered
    if(!this.state.answers.includes(null)){
      // The next anchor is the player screen
      anchor = this.player
      setTimeout(() => {scrollToComponent(anchor, {align:"top"})}, 500)
      return 0;
    }

    setTimeout(() => {scrollToComponent(anchor)}, 500)
  }

  answeredHandler(questionId, answerId) {
    let a = this.state.answers
    a[questionId] = answerId
    this.setState({"answers": a})
    this.gotoNextQuestion(questionId)

    console.log("Question "+questionId + " answered. Answer " + answerId)
    console.log("Questions state:")
    console.log(this.state.answers)

    console.log()
    console.log("Set this answer to all the the players")
    for( var i=0; i<PlayersDb.length; i++ ){
      PlayersDb[i]["a" + questionId] = Math.abs(answerId - PlayersDb[i]["q" + questionId])
    }

    // Filter
    this.filterPlayers()
  }

  filterPlayers(){
    let fp = PlayersDb
    let matchedPlayer = null

    for(var i=0; i<this.state.answers.length; i++){
      // Filter the players with the same values
      if(this.state.answers[i] != null){
        fp = fp.filter(a=>{ return a["q" + i] === this.state.answers[i] })
      }
    }

    console.log("________________________________________________")

    // If no player with the same values, find the nearest
    if( fp.length === 0 ){
      console.log( "No match. Find the nearest player:" )
      console.log( "For each player, find the difference between the player's data and the user's one" )

      let sums = []
      for( var i=0; i<PlayersDb.length; i++ ){
        let sum = 0
        for( var j=0; j<3; j++ ){
          if( PlayersDb[i]["a"+j] != null ){
            sum += PlayersDb[i]["a"+j]
          }
        }
        sums.push(sum)
        PlayersDb[i]["asum"] = sum
      }

      let min = Math.min.apply(null,  sums)
      fp =  PlayersDb.filter(a=>{ return a["asum"] === min })

      console.log( "" )
      console.log( "Smallest value: " + min )
      console.log( "Nearest players pool:" )
      console.log( fp )
      console.log("Pick a random player from this pool:")
      matchedPlayer = fp[Math.floor(Math.random() * fp.length)]
      this.setState({exactMatch: false})
      console.log(matchedPlayer["firstname"] + " " + matchedPlayer["lastname"])

    // Else pick a random player in the filtered pool
    }else{
      console.log( "Matched players pool:" )
      console.log( fp )
      console.log("________________________________________________")
      matchedPlayer = fp[Math.floor(Math.random() * fp.length)]
      this.setState({exactMatch: true})
      console.log( "Pick a random player from this pool:" )
      console.log(matchedPlayer["firstname"] + " " + matchedPlayer["lastname"])
    }

    this.setState({
      matchedPlayer: matchedPlayer
    })

    console.log("=========================================")
    console.log("=========================================")
  }

  componentDidMount(){
      console.log( PlayersDb )
  }

  render() {
    return (
      <div className={"app style-" + this.state.currentTemplate}>
        <Masthead
          inverted={true}
          defaultLanguage="fr"
          mediaName='24heures'
          homepage='//www.24heures.ch'
          articleId='20417500'
          fullMediaName='24 heures'
          hashtags={['24heuresch']} />
        <div className="ui vertical very fitted title">
          <div className='ui container center aligned'>
            <div className='ui'>
              <div>
                <h2 className="surtitre">Coupe du monde 2018 </h2>
                <h1>Quel joueur de légende êtes-vous?</h1>
              </div>
              <div className="start-block"><div className="start-touch" onClick={this.start}>Commencer</div>
                    <div className="shortcut">Ou en lire plus sans répondre aux questions</div>
              </div>
            </div>
          </div>
        </div>
        <div className='questions'>
          { questions.map((question, index) => {
              return (
                      <div className="question-container" id={"question-"+index} key={index}>                          
                        <Question
                          key={index}
                          id={index}
                          questionMax={questions.length}
                          ref={Question => {this.questionComponents[index] = Question;}}
                          onAnswered={this.answeredHandler}
                          title={question.title.toUpperCase()}
                          answers={question.videoAnswers ? question.videoAnswers : question.answers} />
                        <div className="question-skip">Passer les prochaines questions</div>
                      </div>
                      )
              })
          }
        </div>
        <Player
          id="0"
          exactMatch={this.state.exactMatch}
          player={this.state.matchedPlayer}
          answers={this.state.answers}
          ref={Player => {this.player = Player}} />
        
        { /* First section */ }
        <main className='ui vertical very inverted fitted segment text-chapter'>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <div className="section-number">1</div>
              <h1>Entrer dans la légende, porter l’émotion</h1>
              <div className="authors"><b>Texte:</b> Daniel Visentini</div>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <p className="ta lead">
                De ces deux tas de jaquettes ramassés en boule, on pourrait tout dire. Qu’ils ont été jetés au hasard,
                sans projet. Mais le chaos n’existe pas ici: la fausse impression de désordre est trompeuse, ces deux piles-là
                délimitent un but de football dont les dimensions ont minutieusement été calculées, à pied de fourmi.
                Et puis le doute se dissipe, en même temps que cette odeur d’herbe sauvage fraîchement piétinée: c’est
                un terrain de foot qui dessine ses contours fantastiques. Sans public, sans arbitre, sans stade autour. Mais
                avec deux équipes faramineuses composées des plus extraordinaires joueurs de tous les temps.
              </p>
              <p>
                Il y a là Pelé qui ressuscite Cruyff le temps d’une passe magique; il y a Maradona qui défie Yachine par-delà les âges;
                il y a Platini et Puskas, main dans la main, qui déboulent ensemble pour affronter Beckenbauer, ou encore le docteur Socrates,
                drapé dans son élégance féline, qui voit Zidane se démarquer avant de se raviser pour alerter Baggio, mieux placé; tiens: il y a
                même là-bas Shaqiri et Chapuisat et Crisitiano Ronaldo qui s’associent pour déconcerter Iker Casillas, pendant que Van Basten demande
                le ballon. Il y en a tant d’autres, tous convoqués, tous immortels. Tous des légendes, qu’une ribambelle de gamins joyeux incarne pour
                toujours, à chaque fois qu’une cage s’improvise sur un talus et que chacun annonce aussitôt, fièrement, qui il a choisi d’être à
                l’intérieur de cette parenthèse enchantée.
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint inverted'>
                    <div className='icon-container'>
                      <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                    </div>
                    <div className='hint-container'>
                      <div>Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr><span className='pseudo-link'>ou en cliquant ici</span></nobr>.</div>
                    </div>
                  </div>
                </a>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '15%'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint inverted'>
                    <div className='icon-container'>
                      <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                    </div>
                    <div className='hint-container'>
                      <div>Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr><span className='pseudo-link'>ou en cliquant ici</span></nobr>.</div>
                    </div>
                  </div>
                </a>
              </aside>

              <p>
                Une légende du football c’est quoi, sinon ce nom qu’un gosse s’approprie, comme s’il devait revêtir par cette douce usurpation d’identité
                tous les attributs de son héros? Bien sûr, le talent façonne l’hagiographie, sculpte le mythe, le précède en le rendant possible. Mais il y
                a autre chose, un supplément d’âme, sûrement, pour élever celui qui est déjà star au firmament des élus. Les gloires et les accomplissements
                inscrivent sur le papier un palmarès comptable qui se partage avec tout un contingent. Un seul pourtant, souvent, s’échappe de l’inventaire
                pour peupler l’imaginaire collectif. C’est injuste. On dit la France de Zidane ou de Platini, l’Argentine de Maradona ou de Messi, le Portugal
                de Cristiano Ronaldo ou d’Eusébio, le Brésil de Pelé ou de Neymar, l’Allemagne de Beckenbauer ou de Matthäus: à chacun sa génération, mais pour
                tous la distinction.
              </p>

              <p>
                Devenir une légende, c’est sans doute être meilleur que les autres. Mais pour beaucoup de raisons, dont certaines débordent le cadre
                du seul terrain. Si le football est une tragédie grecque - unité de temps, unité de lieu, unité d’action -, il y a, en marge de l’acteur,
                l’homme derrière le rôle. Tenir sa place, dans le théâtre du spectacle programmé, lors d’un Mondial ou en club, c’est la tâche de chacun.
                Occuper la scène jusqu’à en éclipser les autres, pour le bonheur, paradoxalement, de tous les siens, c’est le destin des génies, de ceux
                qui entrent justement dans la légende. Mais comment?
              </p>
              
              <img className="ui fluid image" src={require("./images/graph-invert-13.png")} />

              <p>
                C’est Beckenbauer qui termine sa demi-finale du Mondial 1970 contre l’Italie le bras bandé en écharpe, blessé durant de folles prolongations,
                meurtri mais debout, éliminé mais déjà Kaiser, son futur surnom. C’est le jeune Edson Arantes do Nascimento, autrement dit Pelé, 17 ans, qui
                emmène le Brésil vers sa première Coupe du Monde en 1958, en Suède: il en gagnera trois, seul joueur à cette altitude, dont celle de 1962 où
                il ne jouera pratiquement pas (un match contre le Mexique et 25 minutes avant de se blesser contre la Tchécoslovaquie). Au Chili, c’est grâce
                à Garrincha, ce «petit oiseau» aux pattes bizarres, que le Brésil s’impose, mais l’histoire a la mémoire sélective quand on touche à ses
                légendes, alors pour tous, Pelé l’a aussi gagné, ce Mondial-là…
              </p>
              <p>
                La légende, ce n’est pas que la bravoure indicible ou le récit merveilleux, c’est aussi la geste. C’est l’exceptionnel talent de Maradona,
                qui porte l’Argentine à lui tout seul au titre en 1986 au Mexique. Mais avec cette dualité brutale en quart de finale contre l’Angleterre:
                il triche en marquant un but de la main que seul l’arbitre ne voit pas - la fameuse «main de Dieu» -, avant d’inscrire l’un des plus
                fabuleux buts de l’histoire, passant en revue toute l’équipe anglaise dans un solo inouï de virtuosité technique. C’est toujours ce même
                Maradona, star ultime mais génie froissé, qui quittera la sélection argentine lors de la World Cup 94 aux Etats-Unis, convaincu de dopage.
                Il faut croire qu’entre le bon Dieu et le mauvais démiurge, la cohabitation n’est pas toujours facile.
              </p>
              <p>
                Demandez à Zinédine Zidane. Le héros de toute la France en 1998, pour ce titre mondial qu’il offre aux Bleus avec ses deux têtes en finale
                contre le Brésil. On en oublierait presque son expulsion pour une réaction épidermique dès le deuxième match de la compétition, contre l’Arabie
                saoudite. Ce vilain travers le suit jusqu’en 2006, lors de la finale contre l’Italie, à Berlin: c’est le «coup de boule» sur Materazzi,
                durant les prolongations, avant des tirs au but qu’il suivra des vestiaires, après avoir été logiquement expulsé. Il avait pourtant commencé
                par ouvrir le score, sur un penalty qu’il décidait historique, puisqu’il avait choisi une «Panenka» (un tir risqué au milieu en lob, du nom du
                joueur tchécoslovaque qui l’a inventé, une autre légende pour cette seule inspiration) afin de porter sa griffe définitive sur son parcours:
                entre l’orgueil et la vanité, le génie vacille aussi. Comme pour Maradona, le meilleur des instincts côtoie le pire, jusqu’au dénouement
                «inexcusé» que l’on sait face à Materazzi.
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint inverted'>
                    <div className='icon-container'>
                      <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                    </div>
                    <div className='hint-container'>
                      <div>Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr><span className='pseudo-link'>ou en cliquant ici</span></nobr>.</div>
                    </div>
                  </div>
                </a>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '15%'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint inverted'>
                    <div className='icon-container'>
                      <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                    </div>
                    <div className='hint-container'>
                      <div>Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr><span className='pseudo-link'>ou en cliquant ici</span></nobr>.</div>
                    </div>
                  </div>
                </a>
              </aside>
              
              <p>
                Mais on pardonne tout aux légendes. Il y a comme une grâce qui les enveloppe, dont l’imperfection même garantit l’éternité. Après tout,
                ce qui s’inscrit en marge de la performance pure, pour de bonnes ou de mauvaises raisons, n’existe que pour ramener un instant tous ces
                génies à hauteur d’homme, avant qu’ils ne s’évadent encore au détour d’un dribble improbable, d’une volée irréelle, d’une feinte vertigineuse.
              </p>
              <p>
                Cet été et après encore, au-delà de ce Mondial russe, les stars deviendront légendes dans un cortège où personne ne chasse l’autre. Et l’on
                peut déjà deviner les gamins de demain, réunis autour du ballon, juste avant leur match fantastique mais si réel, plus Cristiano que Ronaldo,
                plus Neymar que Zico, plus Shaqiri que Sutter, plus De Bruyne que Pfaff, ou alors par Hazard. Il suffira d’un geste, d’un éclat, d’un miroitement
                pour que d’autres encore se joignent à cette dance.
              </p>
              <p>
                Etre une légende, c’est peut-être susciter cette émotion-là, qui allume les yeux des enfants, grands et petits.
              </p>
            </div>
          </div>
        </main>
        <main className='ui vertical very fitted segment text-chapter'>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <div className="section-number">2</div>
              <h1>La Suisse et le mondial</h1>
              <div className="authors"><b>Texte:</b> Renaud Tschoumy</div>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p className="ta lead">Nous avons analysé plus d'<b>un siècle de sélections nationales</b>. De 1908 à 2018, voici ce que l'évolution de l'équipe de Suisse nous apprend.</p>
              <p>
                Plus d'un demi-millier de joueurs donec aliquam luctus velit. In lectus purus, efficitur eget gravida sit amet,
                vulputate in est. Suspendisse in lectus et risus fringilla dictum vitae quis nunc. Aliquam placerat,
                convallis. Suspendisse congue lobortis massa vitae eleifend. Aenean in urna libero.</p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">1</div>
                <h2>Le joueur type</h2>
              </div>
              <p>
                Si vos parents avaient été zurichois, s’ils s’étaient appelé Müller et s’ils vous
                avaient prénommé Walter, vous auriez eu plus de chances que les autres d’être
                appelé en équipe de Suisse!
              </p>
              <p>
                Ce nom et ce prénom sont en effet ceux que l’on
                retrouve le plus souvent dans l’historique des sélectionnés. Si vous aviez ajouté
                à cela une taille de 180 cm et une licence à Grasshopper, vous auriez
                définitivement été le joueur parfait pour l’équipe de Suisse.
              </p>
              <img className="ui fluid image" src={require("./images/joueur-03.png")} />
            </div>
          </div>  

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">2</div>
                <h2>Devenir titulaire</h2>
              </div>
              <p>
                Pour être sélectionné en équipe de Suisse, il vaut donc mieux être zurichois.
                C’est en effet, et sans grande surprise, le canton de Zurich qui a fourni le plus
                de joueurs à l’équipe de Suisse depuis 1994 et son retour en phase finale. Plus
                surprenant, le canton classé au deuxième rang: c’est celui du Valais.
              </p>
            </div>
          </div>  

          <div className='ui container computer or lower hidden'>
            <img className="ui fluid image" src={require("./images/dataviz-09.png")} />
          </div>

          <div className='ui container widescreen hidden large screen hidden'>
            <img className="ui fluid image" src={require("./images/dataviz-22.png")} />
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>
                Curabitur dapibus dictum faucibus. Nunc elit mauris, ornare vel ligula id, lacinia dictum ipsum.
                Vestibulum mollis enim eget lacus placerat tincidunt. Ut vitae hendrerit nibh. Vestibulum in
                nunc purus vitae lorem. Etiam elit velit, vehicula eget pellentesque eu, placerat at metus.</p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">3</div>
                <h2>Les participations</h2>
              </div>
              <p>
                Il s’agit de la <b>onzième participation</b> de la Suisse à la phase finale. Non inscrite
                en 1930, elle a participé à six des sept tournois qui ont suivi (Italie 1934, France
                1938, Brésil 1950, Suisse 1954 en tant que pays organisateur, Chili 1962 et
                Angleterre 1966).
              </p>

              <p>
                S’est ensuivie une longue période de disette (28 ans, soit six
                phases finales), jusqu’à la qualification des boys de Roy Hodgson (États-Unis
                1994).
              </p>

              <img className="ui fluid image" src={require("./images/dataviz-19.png")} />

              <p>
                Absente en France en 1998, puis au Japon et en Corée du Sud en 2002,
                <b> la Suisse a, depuis, toujours réussi à se qualifier</b> (Allemagne 2006, Afrique du
                Sud 2010, Brésil 2014 et Russie 2018).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">4</div>
                <h2>Le premier match</h2>
              </div>

              {/*<div class="ui text container no-marg grid equal width">
                <div class="row">
                  <div class="column">
                    <img className="blason_img" src={require("./images/blason_netherland.png")} />
                  </div>
                  <div class="column">
                    <img className="blason_img" src={require("./images/blason_switzerland.png")} />
                  </div>
                </div>
              </div>*/}

              <p>
                Qualifiée pour la Coupe du monde 1934 après un match nul contre la
                Yougoslavie et un victoire par forfait contre la Roumanie, qui avait aligné un
                joueur non sélectionnable, <b>la Suisse dispute son tout premier match de phase
                finale le 27 mai 1934 à Milan</b>, face aux Pays-Bas.
              </p>

              <Scoreboard score={[3,2]} teams={["Suisse", "Pays-Bas"]}/>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div><p>Qualifiée pour la Coupe du monde 1934, La Suisse bat les Pays-Bas et se qualifie pour les quart de finale.</p></div>
                    </div>
                  </div>
                </a>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '30%'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div><p>Qualifiée pour la Coupe du monde 1934, La Suisse bat les Pays-Bas et se qualifie pour les quart de finale.</p></div>
                    </div>
                  </div>
                </a>
              </aside>

              <p>
                Le tournoi réunissant 16
                équipes, ce premier tour n’est autre qu’un huitième de finale. Les Néerlandais
                sont plus nombreux dans les gradins (7000, contre 2000 Suisses environ), mais
                inférieurs sur le terrain.
              </p>
              <p>
                Ce jour-là, Trello Abegglen fait feu de tout bois. Après
                avoir offert les deux premiers buts à Kielholz sur des services d’une précision
                folle (7e et 44e minutes), il inscrit lui-même le troisième but (72 e ). <b>La Suisse bat
                les Pays-Bas</b> <Inlinescore className="score" score={[3,2]} /> et se qualifie pour les quart de finale, où elle sera battue par la
                Tchécoslovaquie, futur finaliste (<Inlinescore className="score" score={[2,3]} />).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">5</div>
                <h2>Le meilleur résultat</h2>
              </div>
              <p>
                La Suisse a atteint les <b>quarts de finale</b> à trois reprises. 
                Mais à cette époque, les phases finales de
                Coupe du monde ne regroupaient que <b>16 équipes</b>. Il était dès lors plus aisé de
                se qualifier pour les quarts de finale, ce que la Suisse n’a jamais réussi à faire
                depuis le passage à 24, puis 32 équipes.
              </p>
            </div>
            <div className='ui container center aligned' style={{margin: "60px 0px"}}>
                <div className="special-panel">
                  <div className="special-dot"></div>
                  <div>1934</div>
                  <span className="special">Italie</span>
                <div><span className="special">1/4 de final</span></div><br/>
                </div>
                <br/>
                <div className="special-panel">
                  <div className="special-dot"></div>
                  <div>1938</div>
                  <span className="special">France</span>
                  <div><span className="special">1/4 de final</span></div><br/>
                </div>
                <div className="special-panel">
                  <div className="special-dot"></div>
                  <div>1954</div>
                  <span className="special">Suisse</span>
                  <div><span className="special">1/4 de final</span></div><br/>
                </div>
            </div>
            <div className='ui text container no-marg'>
              <p>
                Elle a été huitième de finaliste à trois
                reprises depuis son grand retour parmi l’élite. En <b>1994</b>, la Suisse était
                sèchement battue <Inlinescore className="score" score={[0,3]} /> par l’Espagne à Washington. En <b>2006</b>, face à l’Ukraine,
                c’est aux tirs au but qu’elle est éliminée (<Inlinescore className="score" score={[0,0]} /> après 120 minutes de jeu). Marco
                Streller, Tranquillo Barnetta et Ricardo Cabanas manquent tous leur affaire des

                onze mètres. Enfin, en <b>2014</b>, elle pousse l’Argentine de Lionel Messi aux
                prolongations. Elle encaisse l’ouverture du score (Di Maria) à la 118 e minute,
                Dzemaili manquant de peu arracher la séance de tirs au but (tête sur le poteau
                à la 120e).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">6</div>
                <h2>Le match le plus fou</h2>
              </div>
              <Scoreboard score={[7,5]} teams={["Autriche", "Suisse"]} />
              <p>
                Il s’agit sans conteste du fameux quart de finale Suisse – Autriche, le <b>26 juin
                1954</b>. On est à Lausanne, et le stade de la Pontaise affiche complet (35&#39;000
                spectateurs).
              </p>
              <p>
                La Suisse inscrit trois buts (Ballaman, 2 x Hügi) en trois minutes,
                pour mener <Inlinescore className="score" score={[3,9]} /> à la 19 e . Mais une commotion passagère (chute et coup de
                chaleur) prive Bocquet de sa lucidité. Totalement ailleurs, incapable de
                commander sa défense, il laisse son gardien se débattre seul face aux
                attaquants autrichiens.
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div><p>Une commotion prive Bocquet de sa lucidité. Incapable de commander sa défense, il laisse son gardien Parlier se débattre seul.</p></div>
                    </div>
                  </div>
                </a>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '50%'}}>
                <a onClick={this.toggleSidestory} data-story='Gewinne von US-Konzernen' data-target='paneOne'>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div><p>Une commotion prive Bocquet de sa lucidité. Incapable de commander sa défense, il laisse son gardien Parlier se débattre seul.</p></div>
                    </div>
                  </div>
                </a>
              </aside>

              <p>
                Résultat: en neuf minutes, de la 25 e à la 34 e , l’Autriche
                inscrit cinq buts et renverse la vapeur! Ballaman réduit l’écart avant la pause
                (<Inlinescore className="score" score={[4,5]} /> à la 39 e ) avant que Hügi n’inscrive son troisième but personnel (<Inlinescore className="score" score={[5,6]} /> à la
                60 e ), mais la Suisse ne réussit pas à retourner la situation.
              </p>
              <p>
                Score final: <Inlinescore className="score" score={[7,5]} /> pour
                l’Autriche, qui prive la Suisse d’une demi-finale à domicile qui lui tendait les
                bras. Cette rencontre de légende est toujours dans le livre des records: <b>jamais il
                n’a été marqué autant de buts (douze) en une seule rencontre de phase finale</b>.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">7</div>
                <h2>Le plus beau goal</h2>
              </div>
              <p>
                Un choix forcément subjectif, mais on a opté pour le but de <b>Haris Seferovic </b>
                contre l’Équateur, à Brasilia, lors de l’entrée en lice de la Suisse dans le <b>Mondial
                2014</b>, au Brésil (<Inlinescore className="score" score={[2,1]} /> à la 93 e minute).
              </p>
            </div>
          </div>

          <GoalAnimation />

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <p>
                <b>La première</b>: cette volée directe offrait à la Suisse une victoire décisive dans
                l’optique de la qualification pour les huitièmes de finale.
              </p>
              <p><b>La deuxième</b>: il
                symbolise à merveille la volonté de la Suisse, à témoin le tacle salvateur de
                Valon Behrami dans sa surface avant son raid époustouflant.
              </p>
              <p>
                <b>La troisième</b>: il a
                été inscrit après un modèle de contre-attaque. Après avoir écarté une balle de
                but – et évité un penalty – devant Arroyo, Behrami est parti à l’abordage.
                Projeté au sol par Arboleda, il s’est relevé après une roulade et a continué sa
                course folle, avant d’ouvrir sur Seferovic (déjà) à mi-terrain. L’attaquant a
                changé le jeu pour lancer Ricardo Rodriguez sur le côté gauche, avant de venir
                piquer au centre et de convertir le service du latéral, meilleur homme sur le
                terrain ce jour-là.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">8</div>
                <h2>Le maillot à travers les âges</h2>
              </div>
              <p>
                Croix suisse blanche sur un maillot rouge: le graphisme des maillots de l’équipe
                de Suisse semble évident. Il y eut pourtant des exceptions.
              </p>
              <p>
                En 1990, la Suisse est sous contrat avec Blacky, qui propose une ligne novatrice.
                La croix suisse occupe la quasi-totalité du devant du maillot, qui plus est ornée
                de parements noirs. Scandale: comment peut-on jouer sans avoir le symbole du
                pays – qui plus est dénaturé - sur le cœur? C’est pourtant avec ce maillot que
                l’équipe de Suisse du renouveau (celle de Chapuisat, Knup, etc.) obtiendra ses
                premiers résultats de référence, avant de passer chez Lotto pour la campagne
                menant à la phase finale américaine de la World Cup 1994, puis chez Puma en
                1998.
              </p>
            </div>
          </div>

          <div className='ui container'>
            <img className="ui fluid image" src={require("./images/dataviz-18.png")} />
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>
                En 2008, juste avant l’Euro qui se dispute en Suisse et en Autriche, c’est
                justement Puma qui déclenche la polémique au moment de la présentation du
                nouveau maillot: la croix suisse, qui est simplement suggérée par les traits du
                logo de l’Association suisse de football, est jugée «pas assez visible». C’est
                malgré tout avec cet équipement que la Suisse disputera «son» tournoi.
              </p>
              <p>
                Le drapeau suisse fera son retour sur le cœur pour la Coupe du monde 2010 en
                Afrique du Sud, le logo de l’ASF glissant sur le côté droit du maillot.
                Et puis, impossible de parler des maillots suisses sans rappeler l’épisode
                survenu le 19 juin 2016 contre la France, lors du dernier match de groupe de
                l’Euro: les shirts de Mehmedi, Embolo, Dzemaili et Xhaka avaient fini en
                lambeaux. Là, il ne s’agissait pas de graphisme, mais bien d’une erreur de
                fabrication, comme l’a reconnu Puma le lendemain.
              </p>
            </div>
          </div>


          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">9</div>
                <h2>Les souvenirs des vieilles gloires</h2>
              </div>
              <p><b>Vidéo Pascal et Frédéric</b></p>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">10</div>
                <h2>Les romands</h2>
              </div>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
              <img className="ui fluid image" src={require("./images/dataviz-17.png")} />
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">11</div>
                <h2>Les statistiques</h2>
              </div>
              <p>
                L’équipe de Suisse a disputé à ce jour 33 matches en phase finale de Coupe du
                monde. Son bilan global est négatif: 11 victoires, 6 matches nuls et 16 défaites
                pour une différence de buts de – 14 (45 buts marqués, 59 encaissés).
              </p>
              <p>
                La Suisse s’est imposée à trois reprises par trois buts d’écart: <Inlinescore className="score" score={[4,1]} /> contre l’Italie
                en 1954, <Inlinescore className="score" score={[4,1]} /> contre la Roumanie en 1994 et <Inlinescore className="score" score={[3,0]} /> contre le Honduras en 2014.
              </p>
              <p>
                A l’inverse, elle s’est inclinée une fois par cinq buts d’écart (<Inlinescore className="score" score={[0,5]} /> contre
                l’Allemagne en 1966) et quatre fois par trois buts d’écart (<Inlinescore className="score" score={[0,3]} /> contre la
                Yougoslavie en 1950, <Inlinescore className="score" score={[0,3]} /> contre l’Italie en 1962, <Inlinescore className="score" score={[0,3]} /> contre l’Espagne en 1994
                et <Inlinescore className="score" score={[2,5]} /> contre la France en 2014).
              </p>
              <p>
                Le match dans lequel elle a mis le plus de buts est le fameux quart de finale
                contre l’Autriche en 1954: elle a fait trembler les filets à cinq reprises!
                Paradoxalement, elle s’est inclinée <Inlinescore className="score" score={[5,7]} />.
              </p>
              <p>
                La Suisse a dû attendre la Coupe du monde 2006 en Allemagne (et son 23 e
                match en phase finale) pour boucler une rencontre sans encaisser de but: <Inlinescore className="score" score={[0,0]} />
                contre la France. Elle a enchaîné avec trois autres blanchissages cette année-là
                (<Inlinescore className="score" score={[2,0]} /> contre le Togo, <Inlinescore className="score" score={[2,0]} /> contre la Corée du Sud, <Inlinescore className="score" score={[0,0]} /> ap contre l’Ukraine en 8 e de
                finale) pour devenir la seule équipe au monde à avoir été éliminée sans avoir
                encaissé le moindre but dans le jeu (défaite <Inlinescore className="score" score={[0,3]} /> aux tirs au but contre l’Ukraine
                en 8 e ).
              </p>
              <p>
                Le meilleur buteur de la Suisse en phase finale est Sepp Hügi (6 buts), qui
                devance André Abegglen et Robert Ballaman (chacun 4). Suivent Jacky Fatton,
                Leopold Kielholz et Xherdan Shaqiri (3), Alexander Frei et Adrian Knup (2), et
                enfin 18 autres joueurs ayant chacun marqué un but.
              </p>
              <p>
                Sepp Hügi (lors de la défaite <Inlinescore className="score" score={[5,7]} /> contre l’Autriche en 1954) et Xherdan Shaqiri
                (à l’occasion du succès <Inlinescore className="score" score={[3,0]} /> contre le Honduras en 2014) sont les seuls joueurs
                suisses à avoir réussi le coup du chapeau en phase finale.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">12</div>
                <h2>L'argent</h2>
              </div>
              <p>
                La FIFA a considérablement augmenté sa dotation par rapport au Mondial
                brésilien d’il y a quatre ans. En Russie, le 32 pays qualifiés se partageront la
                somme de 400 millions de dollars, ce qui représente une augmentation de 12%
                par rapport aux 358 millions dollars de l’édition 2014.
              </p>
              <p>

                <b>[INFOG PRIMES]</b>

                Chaque pays qualifié recevra une prime de 8 millions de dollars. Les huitièmes
                de finalistes toucheront 9 millions de dollars, les quarts de finalistes 14 millions,
                le quatrième 20 millions, le troisième 22 millions, le finaliste 25 millions et le
                champion du monde 35 millions.
              </p>
              <p>
                Outre ces sommes qui seront donc allouées aux Fédérations en fonction de leur
                parcours en Russie, la FIFA a d’ores et déjà dédommagé les équipes qualifiées
                pour leur frais de préparation à hauteur de 1,5 million de dollars par nation.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">13</div>
                <h2>Le pronostic</h2>
              </div>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
            </div>
          </div>

          <div className='ui container'>
            <div className='ui container no-marg'>
              <Pronocard title="Jeux vidéos" candidates={["Belgique", "France", "Brésil", "Espagne", "Allemagne"]} switzerland="0 fois"/>
              <Pronocard title="Mathématiques" />
              <Pronocard title="Bookmakers" />
              <Pronocard title="Nos journalistes" />
              <Pronocard title="La chèvre" />
            </div>
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
            </div>
          </div>

        </main>

        <footer className='ui vertical segment'>
          <div className='ui container'>
            <div className='ui two column divided stackable grid'>
              {/*<div className='center aligned row teaser-section'>
                <a href='https://interaktiv.tagesanzeiger.ch'>
                  <img
                    src='https://interaktiv.tagesanzeiger.ch/inline-teaser.gif'
                    className='portfolio-teaser'
                  />
                </a>
              </div>*/}
              <div className='stretched aligned row'>
                <div className='column'>
                  <table className='ui definition very basic small infographic table'>
                    <tbody>
                      <tr>
                        <td>Idée</td>
                        <td>
                          DED WCH
                        </td>
                      </tr>
                      <tr>
                        <td>Texte et recherches</td>
                        <td>Renaud Tschoumy, Daniel Visentini</td>
                      </tr>
                      <tr>
                        <td>Vidéos</td>
                        <td>Pascal Wassmer, Frédéric Thomasset</td>
                      </tr>
                      <tr>
                        <td>Concept visuel et illustrations</td>
                        <td>
                          Mathieu Rudaz
                        </td>
                      </tr>
                      <tr>
                        <td>Publié le</td>
                        <td>
                          <TimestampFormatter timestamp={1525222800 - 3600} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='column'>
                  <FeedbackMessage
                    question="Vous voulez communiquer un renseignement ou vous avez repéré une erreur?"
                    call="Envoyez-nous un "
                    mail="message"
                    mailTo='interaktiv@tages-anzeiger.ch' />
                  <div className='ui fluid share container'>
                    <PolymorphicShareButtons
                      articleId='20417500'
                      hashtags={['TAGrafik', 'ddj']}
                      displayType={displayTypes.VERTICAL_BUTTONS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    );
  }
}

export default App;
