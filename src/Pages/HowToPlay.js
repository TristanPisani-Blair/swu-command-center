import React from "react";
import './HowToPlay.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import setupimg from '../Components/Assets/large_SWH_Web_Diagram7_480f2f6c88.png'


const HowToPlay = () => {
    return (
      <div>
          <Navbar />

        <div className="container" class="wrapper">
          <div className="leftNav">
            <ul>
              <li><a href="#Rules">Rules</a></li>
              <li><a href="#Setup">Setup</a></li>
            </ul>
          </div>

          <div className="how-to-play-body">
              <h1>How to Play</h1>
              <div>
                <hr className="divider" />
              </div>
              <div className="rules-section">
                <h2 className="rules-header" id="Rules">Rules</h2>
                <p>Quickstart Rules<a href="https://images-cdn.fantasyflightgames.com/filer_public/36/f6/36f6e0a5-a7a9-4cbe-8d73-70e61fe6f548/sw_unlimited_quickstart_rules.pdf" target="_blank" rel="noopener noreferrer" /></p>
                <p>Comprehensive Rules<a href="https://cdn.starwarsunlimited.com//SWH_Comp_Rules_v1_1_304cb9bb9c.pdf" target="_blank" rel="noopener noreferrer" /></p>
              </div>

              <div className="setup-section">
                <h2 className="setup-header" id="Setup">Setup</h2>
                <img src={setupimg} />
                <h1 id="Game Setup">Game Setup:</h1>
                  <p>To begin playing Star Wars: Unlimited, each player places their base at the center of the table. Then, beneath their base, players position their 
                    leader cards horizontally with the non-unit side facing up.</p>

                  <p>Next, decide randomly which player will start with the initiative and give them the initiative counter. Once this is determined, both players 
                    shuffle their decks and draw a hand of 6 cards. Each player is allowed one "mulligan," wherein they shuffle their entire hand back into their 
                    deck and draw a new hand of 6 cards. Keep in mind that the new hand must be kept, regardless of its contents.</p>

                  <p>Following the hand draw, each player selects 2 cards from their hand to place face-down in front of them as "resources." These resources will 
                    be utilized to pay for cards played during the game and cannot be used for their own abilities.</p>

                  <p>Once both players have completed these steps, the game proceeds to the first action phase.</p>

                  <h1 id="The Action Phase">The Action Phase:</h1>
                  <p>During this phase, players alternate taking single actions. The player holding the initiative counter begins by taking their action, followed 
                    by their opponent, and so forth until both players have passed. Available actions include playing a card, initiating an attack with a unit, using 
                    an action ability, seizing the initiative, or passing.</p>

                  <h1 id="Playing a Card">Playing a Card:</h1>
                  <p>To play a card, you need to "exhaust" (turn sideways) resources equal to the card's cost from your hand, then play it. Once exhausted, a resource 
                    can't be used again until it's "readied" (turned back upright). Each card's cost is indicated in the top-left corner. For instance, 
                    R2-D2 (Spark of Rebellion, 236) costs 1 resource to play, while I Am Your Father (Spark of Rebellion, 233) costs 3.</p>

                  <p>Units are played exhausted and belong to either the ground or space arena, determined by the first unit played. For example, if the first unit is 
                    an Alliance X-Wing (Spark of Rebellion, 237), the arena it's played into becomes the space arena. Units can only attack within their own arena.
                    When a unit is played, resolve any "When Played" abilities it has. Upgrades must be attached to a unit and typically boost its power and HP. 
                    Events have an immediate effect upon being played and are then discarded.</p>

                  <h1 id="Attacking With a Unit">Attacking With a Unit:</h1>
                  <p>To attack, exhaust a ready unit you control and choose a target: either an enemy unit in the same arena or your opponent's base. Damage dealt 
                    to the base equals the attacking unit's power. The goal is to destroy your opponent's base.</p>

                  <p>When attacking an enemy unit, both units deal damage to each other simultaneously based on their power. Units can't attack on the turn they're 
                    played unless they have the Ambush ability.</p>

                  <h1 id="Using an Action Ability">Using an Action Ability:</h1>
                  <p>Resolve any Action abilities on cards, paying any required costs. For example, Admiral Ozzel (Spark of Rebellion, 129) allows playing an 
                    Imperial unit from hand and entering it ready at the cost of exhausting him.</p>

                  <h1 id="Take Initiative/Pass">Take Initiative / Pass:</h1>
                  <p>Choose either to pass or take the initiative. Passing lets your opponent take their turn first, while taking the initiative ensures you act 
                    first in the next round but automatically passes for all subsequent actions.</p>

                  <h1 id="Regroup Phase">Regroup Phase:</h1>
                  <p>This phase consists of drawing cards, resourcing a card, and readying cards. Draw 2 cards, optionally resource a card from your hand, and 
                    then ready all exhausted cards. Once complete, return to the action phase with the player holding the initiative counter taking the first action.</p>
                  <br />
                  <p className="end-body"><strong>That's the basics of Star Wars: Unlimited gameplay. Simple yet strategic, with endless possibilities for creative play!</strong></p>
              </div>
            </div>

            <div className="rightNav">
              <p className="jumpTo">Jump to:</p>
              <ul>
                <li><a href="#Game Setup">Game Setup</a></li>
                <li><a href="#The Action Phase">The Action Phase</a></li>
                <li><a href="#Playing a Card">Playing a Card</a></li>
                <li><a href="#Attacking With a Unit">Attacking With a Unit</a></li>
                <li><a href="#Using an Action Ability">Using an Action Ability</a></li>
                <li><a href="#Take Initiative/Pass">Take Initiative/Pass</a></li>
                <li><a href="#Regroup Phase">Regoup Phase</a></li>
              </ul>
            </div>

          <Footer />
        </div>
      </div>
    );
  }
  
  export default HowToPlay;
