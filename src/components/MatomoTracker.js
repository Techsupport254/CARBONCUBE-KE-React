import React from "react";

export default function MatomoTracker() {
	React.useEffect(() => {
		// Matomo temporarily disabled due to 404 error
		// TODO: Fix Matomo container URL or implement proper Matomo setup
		/*
		var _mtm = (window._mtm = window._mtm || []);
		_mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
		var d = document,
			g = d.createElement("script"),
			s = d.getElementsByTagName("script")[0];
		g.async = true;
		g.src =
			"https://cdn.matomo.cloud/carboncubeke.matomo.cloud/container_6Rza2oIF.js";
		s.parentNode.insertBefore(g, s);
		*/
	}, []);

	return null; // This component doesn't render anything
}
