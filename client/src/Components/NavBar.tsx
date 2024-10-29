import React from "react";

interface NavBarProps {
  loggedIn: boolean;
}

function NavBar({ loggedIn }: NavBarProps) {
  return (
    <div>
      <nav>
        <div>
          <a href="/">Home</a>
          <a href="/snake">Snake</a>
          <a href="/minesweeper">Minesweeper</a>
          <a href="/leaderboard">Leaderboard</a>
        </div>
        <div>
          {loggedIn ? (
            <div>
              <a href="/accounts">Your Account</a>
            </div>
          ) : (
            <div>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
