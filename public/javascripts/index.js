class Puissance4 {
  /*
    Intialise un plateau de jeu de dimensions `rows` × `cols` (par défaut 6×7),
    et fait l'affichage dans l'élément `element_id` du DOM.
   */
  constructor(element_id, rows = 6, cols = 7) {
    // Nombre de lignes et de colonnes
    this.rows = rows;
    this.cols = cols;
    // ce tableau à deux dimensions contient l'état du jeu:
    //   0: case vide
    //   1: pion du joueur 1
    //   2: pion du joueur 2
    this.board = Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = Array(this.cols).fill(0);
    }
    // un entier: 1 ou 2 (le numéro du prochain joueur)
    this.turn = 1;
    // Nombre de coups joués
    this.moves = 0;
    /* un entier indiquant le gagnant:
        null: la partie continue
           0: la partie est nulle
           1: joueur 1 a gagné
           2: joueur 2 a gagné
    */
    this.winner = null;

    // L'élément du DOM où se fait l'affichage
    this.element = document.querySelector(element_id);
    // On ajoute le gestionnaire d'événements pour gérer le click
    //
    // Pour des raisons techniques, il est nécessaire de passer comme gestionnaire
    // une fonction anonyme faisant appel à `this.handle_click`. Passer directement
    // `this.handle_click` comme gestionnaire, sans wrapping, rendrait le mot clef
    // `this` inutilisable dans le gestionnaire. Voir le "binding de this".

    this.element.addEventListener('click', (event) => this.handle_click(event));

    // On fait l'affichage
    this.render();
  }

  /* Affiche le plateau de jeu dans le DOM */
  render() {
    let table = document.createElement('table');
    //ATTENTION, la page html est écrite de haut en bas. Les indices
    //pour le jeu vont de bas en haut (compteur i de la boucle)
    for (let i = this.rows - 1; i >= 0; i--) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let j = 0; j < this.cols; j++) {
        let td = tr.appendChild(document.createElement('td'));
        let colour = this.board[i][j];
        if (colour) td.className = 'player' + colour;
        td.dataset.column = j;
      }
    }
    this.element.innerHTML = '';
    this.element.appendChild(table);
    if (this.turn == 1) {
      document.getElementById('Joueur').innerHTML = 'Joueur 1';
    } else {
      document.getElementById('Joueur').innerHTML = 'Joueur 2';
    }
  }

  set(row, column, player) {
    // On colore la case
    this.board[row][column] = player;
    // On compte le coup
    this.moves++;
  }

  /* Cette fonction ajoute un pion dans une colonne */
  play(column) {
    // Trouver la première case libre dans la colonne
    let row;
    for (let i = 0; i < this.rows; i++) {
      if (this.board[i][column] == 0) {
        row = i;
        break;
      }
    }
    if (row === undefined) {
      return null;
    } else {
      // Effectuer le coup
      this.set(row, column, this.turn);
      // Renvoyer la ligne où on a joué
      return row;
    }
  }
  drawModal() {
    const modal = document.querySelector('.draw');

    modal.classList.remove('hidden');

    modal.querySelector('.btn-close').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  win1Modal() {
    const modal = document.querySelector('.player1');
    modal.classList.remove('hidden');

    document.querySelector('.player1').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  win2Modal() {
    const modal = document.querySelector('.player2');
    modal.classList.remove('hidden');

    document.querySelector('.player2').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  handle_click(event) {
    // Vérifier si la partie est encore en cours
    if (this.winner !== null) {
      this.reset();
      this.render();

      return;
    }

    let column = event.target.dataset.column;

    if (column !== undefined) {
      //attention, les variables dans les datasets sont TOUJOURS
      //des chaînes de caractères. Si on veut être sûr de ne pas faire de bêtise,
      //il vaut mieux la convertir en entier avec parseInt
      column = parseInt(column);
      let row = this.play(parseInt(column));

      if (row === null) {
        window.alert('Column is full!');
      } else {
        // Vérifier s'il y a un gagnant, ou si la partie est finie
        if (this.win(row, column, this.turn)) {
          this.winner = this.turn;
        } else if (this.moves >= this.rows * this.columns) {
          this.winner = 0;
        }
        // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
        this.turn = 3 - this.turn;

        // Mettre à jour l'affichage
        this.render();

        //Au cours de l'affichage, pensez eventuellement, à afficher un
        //message si la partie est finie...
        switch (this.winner) {
          case 0:
            this.drawModal();
            break;
          case 1:
            this.win1Modal();
            break;
          case 2:
            this.win2Modal();
            break;
        }
      }
    }
  }

  /* 
   Cette fonction vérifie si le coup dans la case `row`, `column` par
   le joueur `player` est un coup gagnant.
   
   Renvoie :
     true  : si la partie est gagnée par le joueur `player`
     false : si la partie continue
 */
  win(row, column, player) {
    // Horizontal
    let count = 0;
    for (let j = 0; j < this.cols; j++) {
      count = this.board[row][j] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Vertical
    count = 0;
    for (let i = 0; i < this.rows; i++) {
      count = this.board[i][column] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Diagonal
    count = 0;
    let shift = row - column;
    for (
      let i = Math.max(shift, 0);
      i < Math.min(this.rows, this.cols + shift);
      i++
    ) {
      count = this.board[i][i - shift] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Anti-diagonal
    count = 0;
    shift = row + column;
    for (
      let i = Math.max(shift - this.cols + 1, 0);
      i < Math.min(this.rows, shift + 1);
      i++
    ) {
      console.log(i, shift - i, shift);
      count = this.board[i][shift - i] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }

    return false;
  }

  // Cette fonction vide le plateau et remet à zéro l'état
  reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
      }
    }
    this.move = 0;
    this.winner = null;
  }
}
//

class PuissanceRobot {
  /*
    Intialise un plateau de jeu de dimensions `rows` × `cols` (par défaut 6×7),
    et fait l'affichage dans l'élément `element_id` du DOM.
   */
  constructor(element_id, rows = 6, cols = 7) {
    // Nombre de lignes et de colonnes
    this.rows = rows;
    this.cols = cols;
    // ce tableau à deux dimensions contient l'état du jeu:
    //   0: case vide
    //   1: pion du joueur 1
    //   2: pion du joueur 2
    this.board = Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = Array(this.cols).fill(0);
    }
    // un entier: 1 ou 2 (le numéro du prochain joueur)
    this.turn = 1;
    // Nombre de coups joués
    this.moves = 0;
    /* un entier indiquant le gagnant:
        null: la partie continue
           0: la partie est nulle
           1: joueur 1 a gagné
           2: joueur 2 a gagné
    */
    this.winner = null;

    // L'élément du DOM où se fait l'affichage
    this.element = document.querySelector(element_id);
    // On ajoute le gestionnaire d'événements pour gérer le click
    //
    // Pour des raisons techniques, il est nécessaire de passer comme gestionnaire
    // une fonction anonyme faisant appel à `this.handle_click`. Passer directement
    // `this.handle_click` comme gestionnaire, sans wrapping, rendrait le mot clef
    // `this` inutilisable dans le gestionnaire. Voir le "binding de this".

    this.element.addEventListener('click', (event) => this.handle_click(event));

    // On fait l'affichage
    this.render();
  }

  /* Affiche le plateau de jeu dans le DOM */
  render() {
    let table = document.createElement('table');
    //ATTENTION, la page html est écrite de haut en bas. Les indices
    //pour le jeu vont de bas en haut (compteur i de la boucle)
    for (let i = this.rows - 1; i >= 0; i--) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let j = 0; j < this.cols; j++) {
        let td = tr.appendChild(document.createElement('td'));
        let colour = this.board[i][j];
        if (colour) td.className = 'player' + colour;
        td.dataset.column = j;
      }
    }
    this.element.innerHTML = '';
    this.element.appendChild(table);
    document.getElementById('Joueur').innerHTML = 'Partie contre Robot';
  }

  set(row, column, player) {
    // On colore la case
    this.board[row][column] = player;
    // On compte le coup
    this.moves++;
  }

  /* Cette fonction ajoute un pion dans une colonne */
  play(column) {
    // Trouver la première case libre dans la colonne
    let row;
    for (let i = 0; i < this.rows; i++) {
      if (this.board[i][column] == 0) {
        row = i;
        break;
      }
    }
    if (row === undefined) {
      return null;
    } else {
      // Effectuer le coup
      this.set(row, column, this.turn);
      // Renvoyer la ligne où on a joué
      return row;
    }
  }
  drawModal() {
    const modal = document.querySelector('.draw');

    modal.classList.remove('hidden');

    modal.querySelector('.btn-close').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  win1Modal() {
    const modal = document.querySelector('.player1');
    modal.classList.remove('hidden');

    document.querySelector('.player1').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  win2Modal() {
    const modal = document.querySelector('.player2');
    modal.classList.remove('hidden');

    document.querySelector('.player2').addEventListener('click', (e) => {
      modal.classList.add('hidden');
      document.location.reload();
    });
    modal.querySelector('#reload').addEventListener('click', (e) => {
      this.reset();
      this.render();
      modal.classList.add('hidden');
    });
  }
  handle_click(event) {
    // Vérifier si la partie est encore en cours
    if (this.winner !== null) {
      this.reset();
      this.render();

      return;
    }

    let column = event.target.dataset.column;

    if (column !== undefined) {
      //attention, les variables dans les datasets sont TOUJOURS
      //des chaînes de caractères. Si on veut être sûr de ne pas faire de bêtise,
      //il vaut mieux la convertir en entier avec parseInt
      column = parseInt(column);
      let row = this.play(parseInt(column));

      if (row === null) {
        window.alert('Column is full!');
      } else {
        // Vérifier s'il y a un gagnant, ou si la partie est finie
        if (this.win(row, column, this.turn)) {
          this.winner = this.turn;
        } else if (this.moves >= this.rows * this.columns) {
          this.winner = 0;
        }
        // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
        this.turn = 3 - this.turn;

        // Mettre à jour l'affichage
        this.render();

        //Au cours de l'affichage, pensez eventuellement, à afficher un
        //message si la partie est finie...
        switch (this.winner) {
          case 0:
            this.drawModal();
            break;
          case 1:
            this.win1Modal();
            break;
          case 2:
            this.win2Modal();
            break;
        }
      }
    }
    setTimeout(() => {
      this.robot_turn();
    }, 350);
  }
  robot_turn() {
    // Vérifier si la partie est encore en cours
    if (this.winner !== null) {
      this.reset();
      this.render();

      return;
    }

    let column = ~~(Math.random() * 6) + 0;
    if (column !== undefined) {
      //attention, les variables dans les datasets sont TOUJOURS
      //des chaînes de caractères. Si on veut être sûr de ne pas faire de bêtise,
      //il vaut mieux la convertir en entier avec parseInt
      column = parseInt(column);
      let row = this.play(parseInt(column));

      if (row === null) {
        window.alert('Column is full!');
      } else {
        // Vérifier s'il y a un gagnant, ou si la partie est finie
        if (this.win(row, column, this.turn)) {
          this.winner = this.turn;
        } else if (this.moves >= this.rows * this.columns) {
          this.winner = 0;
        }
        // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
        this.turn = 3 - this.turn;

        // Mettre à jour l'affichage
        this.render();

        //Au cours de l'affichage, pensez eventuellement, à afficher un
        //message si la partie est finie...
        switch (this.winner) {
          case 0:
            this.drawModal();
            break;
          case 1:
            this.win1Modal();
            break;
          case 2:
            this.win2Modal();
            break;
        }
      }
    }
  }

  /* 
   Cette fonction vérifie si le coup dans la case `row`, `column` par
   le joueur `player` est un coup gagnant.
   
   Renvoie :
     true  : si la partie est gagnée par le joueur `player`
     false : si la partie continue
 */
  win(row, column, player) {
    // Horizontal
    let count = 0;
    for (let j = 0; j < this.cols; j++) {
      count = this.board[row][j] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Vertical
    count = 0;
    for (let i = 0; i < this.rows; i++) {
      count = this.board[i][column] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Diagonal
    count = 0;
    let shift = row - column;
    for (
      let i = Math.max(shift, 0);
      i < Math.min(this.rows, this.cols + shift);
      i++
    ) {
      count = this.board[i][i - shift] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Anti-diagonal
    count = 0;
    shift = row + column;
    for (
      let i = Math.max(shift - this.cols + 1, 0);
      i < Math.min(this.rows, shift + 1);
      i++
    ) {
      console.log(i, shift - i, shift);
      count = this.board[i][shift - i] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }

    return false;
  }

  // Cette fonction vide le plateau et remet à zéro l'état
  reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
      }
    }
    this.move = 0;
    this.winner = null;
  }
}

// On initialise le plateau et on visualise dans le DOM
// (dans la balise d'identifiant `game`).
const choiceModal = document.querySelector('#choice');
const nameModal = document.querySelector('#chooseName');

document.querySelector('#playHuman').addEventListener('click', (e) => {
  choiceModal.classList.add('hidden');
  nameModal.classList.remove('hidden');
  nameModal.addEventListener('submit', (e) => {
    nameModal.classList.add('hidden');
    let p4 = new Puissance4('#game');
  });
});
document.querySelector('#playRobot').addEventListener('click', (e) => {
  choiceModal.classList.add('hidden');
  let p4 = new PuissanceRobot('#game');
});
// const human1 = ;
// const human2 = ;
