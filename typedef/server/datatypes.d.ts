
interface CardData implements Transform {
	front: string,
	back: string,
	flipped?: boolean,
	
	position?: Vector2,
	rotation?: number;
	scale?: Vector2;
}


interface DeckData implements Transform {
	cards?: CardData[],
	shuffle?: boolean,

	position?: Vector2,
	rotation?: number;
	scale?: Vector2;
}

interface GameData {
	cards: CardData[],
	decks: DeckData[],
}
