{
  description = "Nix flake Node.js development environment";

  inputs = {
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs-unstable, ... }:
    let
      system = "x86_64-linux";

    in
    {
      devShells.${system}.default =
        let
          pkgs = import nixpkgs-unstable { inherit system; };

        in
        pkgs.mkShell {
          packages = [
            pkgs.nodePackages.nodejs # node 20.17.0
          ];
        };
    };
}
