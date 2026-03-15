import { Button } from "../Button"

export const TopBar = () => {
    return(
        <div className="flex w-full h-fit justify-between px-3 py-2">
            <Button variant="ghost">Logo</Button>
            <div>
                <Button variant="ghost">Listings</Button>
                <Button variant="ghost">About us</Button>
            </div>
            <Button>Login</Button>
        </div>
    )
}