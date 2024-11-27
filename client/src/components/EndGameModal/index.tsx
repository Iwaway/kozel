import { useSelector } from "react-redux";
import { Game, Team } from "../../interfaces/game"
import { RootState } from "../../app/store";


export const EndGameModal = (props: {game: Game, winnerTeam: Team, onClose?: () => void}) => {
    const { game, winnerTeam, onClose } = props;

    const winners = game.users.filter(v => v.teamId === winnerTeam.teamId);
    const user = useSelector((state: RootState) => state.user);
    const lobbyUsers = useSelector((state: RootState) => state.lobbyUsers.users);
    const ws = useSelector((state: RootState) => state.ws.webSocket);

    const isLeader = () => {
        return user.nickname === lobbyUsers.filter(v => v.isLeader === true)[0].nickname;
    };

    const onClick = (action: 'resetGame' | 'closeGame') => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'game', data: {route: action, data: {gameId: game?.gameId}}}));
        };
    };

    return (
        <div className="absolute top-0 w-full h-full min-w-full min-h-full bg-black bg-opacity-50 flex justify-center items-center z-[150]">
            <div className="bg-white border-[2px] border-orange-500 rounded-[6px] w-1/2">
                <div className="flex justify-center items-center w-full rounded-t-[4px] py-1 border-b-[2px] border-orange-500 bg-orange-700 text-white font-bold">
                    <h1>End game</h1>
                </div>
                <div className="w-full flex flex-col gap-1 justify-center items-center pt-1 pb-4">
                    <p className="pb-4">Team {winnerTeam.teamId} won this game!</p>
                    <p>Winners:</p>
                    <div className="flex flex-row gap-2">
                        {winners.map((winner, index) => {
                            return (
                                <p key={index}>{winner.nickname}</p>
                            )
                        })}
                    </div>
                </div>
                { isLeader() &&
                    <div className="w-full flex justify-between p-2 flex-row items-center">
                        <button onClick={() => onClick('resetGame')} className="bg-green-200 p-1 border-[2px] border-green-500 rounded-[6px]">New game</button>
                        <button onClick={() => onClick('closeGame')} className="bg-red-200 p-1 border-[2px] border-red-500 rounded-[6px]">Close game</button>
                    </div>
                }
            </div>
        </div>
    )
}