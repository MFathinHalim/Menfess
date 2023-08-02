{ pkgs }: {
	deps = [
		pkgs.nodejs-16_x
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}