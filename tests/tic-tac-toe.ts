import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicTacToe } from "../target/types/tic_tac_toe";
import { expect } from 'chai'

async function play(
  program: Program<TicTacToe>,
  game,
  player,
  tile,
  expectedTurn,
  expectedGameState,
  expectedBoard
) {
  await program.methods
    .play(tile)
    .accounts({
      player: player.publicKey,
      game,
    })
    .signers(player instanceof (anchor.Wallet as any) ? [] : [player])
    .rpc()


  const gameState = await program.account.game.fetch(game)
  expect(gameState.turn).to.equal(expectedTurn)
  expect(gameState.state).to.eql(expectedGameState)
  expect(gameState.board).to.eql(expectedBoard)
}

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  it('setup game!', async () => {
    const gameKeypair = anchor.web3.Keypair.generate()
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate()
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc()

    let gameState = await program.account.game.fetch(gameKeypair.publicKey)
    expect(gameState.turn).to.equal(1)
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey])
    expect(gameState.state).to.eql({ active: {} })
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])
  })

  it('player one wins', async () => {
    const gameKeypair = anchor.web3.Keypair.generate()
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate()
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc()


    let gameState = await program.account.game.fetch(gameKeypair.publicKey)
    expect(gameState.turn).to.equal(1)
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey])
    expect(gameState.state).to.eql({ active: {} })
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])


    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 0 },
      2,
      { active: {} },
      [
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 1 },
      3,
      { active: {} },
      [
        [{ x: {} }, null, null],
        [null, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 1 },
      4,
      { active: {} },
      [
        [{ x: {} }, { x: {} }, null],
        [null, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 2 },
      5,
      { active: {} },
      [
        [{ x: {} }, { x: {} }, null],
        [null, { o: {} }, { o: {} }],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 2 },
      5,
      { won: { winner: playerOne.publicKey } },
      [
        [{ x: {} }, { x: {} }, { x: {} }],
        [null, { o: {} }, { o: {} }],
        [null, null, null],
      ]
    )
  })


  it('player two wins', async () => {
    const gameKeypair = anchor.web3.Keypair.generate()
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate()
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc()


    let gameState = await program.account.game.fetch(gameKeypair.publicKey)
    expect(gameState.turn).to.equal(1)
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey])
    expect(gameState.state).to.eql({ active: {} })
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])


    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 0 },
      2,
      { active: {} },
      [
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 1 },
      3,
      { active: {} },
      [
        [{ x: {} }, null, null],
        [null, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 1 },
      4,
      { active: {} },
      [
        [{ x: {} }, { x: {} }, null],
        [null, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 0, column: 2 },
      5,
      { active: {} },
      [
        [{ x: {} }, { x: {} }, { o: {} }],
        [null, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 1, column: 0 },
      6,
      { active: {} },
      [
        [{ x: {} }, { x: {} }, { o: {} }],
        [{ x: {} }, { o: {} }, null],
        [null, null, null],
      ]
    )

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 2, column: 0 },
      6,
      { won: { winner: playerTwo.publicKey } },
      [
        [{ x: {} }, { x: {} }, { o: {} }],
        [{ x: {} }, { o: {} }, null],
        [{ o: {} }, null, null],
      ]
    )
  })


  it('tie', async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([[null, null, null], [null, null, null], [null, null, null]]);

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 0 },
      2,
      { active: {}, },
      [
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 1 },
      3,
      { active: {}, },
      [
        [{ x: {} }, null, null],
        [null, { o: {} }, null],
        [null, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 2, column: 0 },
      4,
      { active: {}, },
      [
        [{ x: {} }, null, null],
        [null, { o: {} }, null],
        [{ x: {} }, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 0 },
      5,
      { active: {}, },
      [
        [{ x: {} }, null, null],
        [{ o: {} }, { o: {} }, null],
        [{ x: {} }, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 1, column: 2 },
      6,
      { active: {}, },
      [
        [{ x: {} }, null, null],
        [{ o: {} }, { o: {} }, { x: {} }],
        [{ x: {} }, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 0, column: 1 },
      7,
      { active: {}, },
      [
        [{ x: {} }, { o: {} }, null],
        [{ o: {} }, { o: {} }, { x: {} }],
        [{ x: {} }, null, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 2, column: 1 },
      8,
      { active: {}, },
      [
        [{ x: {} }, { o: {} }, null],
        [{ o: {} }, { o: {} }, { x: {} }],
        [{ x: {} }, { x: {} }, null]
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 2, column: 2 },
      9,
      { active: {}, },
      [
        [{ x: {} }, { o: {} }, null],
        [{ o: {} }, { o: {} }, { x: {} }],
        [{ x: {} }, { x: {} }, { o: {} }]
      ]
    );


    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 2 },
      9,
      { tie: {}, },
      [
        [{ x: {} }, { o: {} }, { x: {} }],
        [{ o: {} }, { o: {} }, { x: {} }],
        [{ x: {} }, { x: {} }, { o: {} }]
      ]
    );
  })

  it('out of bounds row - error test', async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([[null, null, null], [null, null, null], [null, null, null]]);

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerTwo,
        { row: 5, column: 1 }, // ERROR: out of bounds row
        2,
        { active: {} },
        [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ]
      )
      // we use this to make sure we definitely throw an error
      chai.assert(false, "should've failed but didn't ")
    } catch (_err) {
      expect(_err).to.be.instanceOf(anchor.AnchorError)
      const err: anchor.AnchorError = _err
      expect(err.error.errorCode.number).to.equal(6003)
    }
  });

  it('same player in subsequent turns - error test', async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([[null, null, null], [null, null, null], [null, null, null]]);

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        { row: 0, column: 0 },
        2,
        { active: {} },
        [
          [{ x: {} }, null, null],
          [null, null, null],
          [null, null, null],
        ]
      )

      await play(
        program,
        gameKeypair.publicKey,
        playerOne, // ERROR: same player in subsequent turns


        // change sth about the tx because
        // duplicate tx that come in too fast
        // after each other may get dropped
        { row: 1, column: 0 },
        3,
        { active: {} },
        [
          [{ x: {} }, null, null],
          [{ x: {} }, null, null],
          [null, null, null],
        ]
      )
      chai.assert(false, "should've failed but didn't ")
    } catch (_err) {
      expect(_err).to.be.instanceOf(anchor.AnchorError)
      const err: anchor.AnchorError = _err
      expect(err.error.errorCode.code).to.equal('NotPlayersTurn')
      expect(err.error.errorCode.number).to.equal(6003)
      expect(err.program.equals(program.programId)).is.true
      expect(err.error.comparedValues).to.deep.equal([
        playerTwo.publicKey,
        playerOne.publicKey,
      ])
    }
  });
});