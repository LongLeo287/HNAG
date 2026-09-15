export type AppPlatform = "ios" | "android" | "desktop";
export type ExternalAppId = "grab" | "shopee" | "be" | "xanh" | "maps";

export function detectAppPlatform(device?: { userAgent: string; maxTouchPoints: number }): AppPlatform {
  if (!device) return "desktop";
  if (/android/i.test(device.userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(device.userAgent) || (/Macintosh/i.test(device.userAgent) && device.maxTouchPoints > 1)) return "ios";
  return "desktop";
}

interface AppDestination {
  name: string;
  iosUrl: string;
  androidUrl: string;
  androidPackage: string;
  appleId: string;
  webUrl: string;
}

export interface ExternalAppLink {
  name: string;
  href: string;
  installUrl: string;
  target: "_self" | "_blank";
}

/** Native destinations verified against provider-owned pages on 2026-09-12.
 * Grab's own common-utils bundle uses GRABFOOD/searchParameter; the reference repo
 * adds support-deeplink=true to its web fallback. ShopeeFood publishes its schemes
 * as App Links metadata. Be/Green SM publish theirs on their official app landing links.
 * No provider SDK, API, installed-app probing or delayed navigation is involved.
 */
export interface LocationContextHint {
  label?: string;
  position?: { latitude: number; longitude: number };
}

export function buildExternalAppLinks(
  dishName: string,
  platform: AppPlatform,
  locationHint?: LocationContextHint,
): Record<ExternalAppId, ExternalAppLink> {
  const query = encodeURIComponent(dishName);
  const areaPart = locationHint?.label
    ? locationHint.label.split(",").slice(0, 2).join(", ").trim()
    : "";
  const locationText = areaPart ? ` ${areaPart}` : " gần đây";
  const nearby = encodeURIComponent(`${dishName}${locationText}`);
  const grabNative = `grab://open?screenType=GRABFOOD&searchParameter=${query}`;
  const centerParam = locationHint?.position
    ? `&center=${locationHint.position.latitude},${locationHint.position.longitude}`
    : "";
  const mapsWeb = `https://www.google.com/maps/search/?api=1&query=${nearby}${centerParam}`;
  const destinations: Record<ExternalAppId, AppDestination> = {
    grab: {
      name: "GrabFood", iosUrl: grabNative, androidUrl: grabNative,
      androidPackage: "com.grabtaxi.passenger", appleId: "647268330",
      webUrl: `https://food.grab.com/vn/vi/restaurants?search=${query}&support-deeplink=true&searchParameter=${query}`,
    },
    shopee: {
      name: "ShopeeFood", iosUrl: "vn.foody.DeliveryNow://home", androidUrl: "deliverynow://home",
      androidPackage: "com.deliverynow", appleId: "1137866760",
      webUrl: "https://www.shopeefood.vn/",
    },
    be: {
      name: "beFood", iosUrl: "xyz.be.customer://home", androidUrl: "xyz.be.customer://home",
      androidPackage: "xyz.be.customer", appleId: "1440565902",
      webUrl: "https://begroup.onelink.me/ZOqn/becustomerapp",
    },
    xanh: {
      name: "Xanh SM", iosUrl: "xanhsm.com://homepage", androidUrl: "xanhsm.com://homepage",
      androidPackage: "com.gsm.customer", appleId: "6446425595",
      webUrl: "https://vn.greensm.com/3eCA/8li1xfm7",
    },
    maps: {
      name: "Google Maps", iosUrl: `comgooglemaps://?q=${nearby}`, androidUrl: mapsWeb,
      androidPackage: "com.google.android.apps.maps", appleId: "585027354", webUrl: mapsWeb,
    },
  };

  function resolve(destination: AppDestination): ExternalAppLink {
    const installUrl = platform === "android"
      ? `https://play.google.com/store/apps/details?id=${destination.androidPackage}`
      : `https://apps.apple.com/vn/app/id${destination.appleId}`;
    let href = destination.webUrl;
    if (platform === "ios") href = destination.iosUrl;
    if (platform === "android") {
      const [scheme, path] = destination.androidUrl.split("://");
      href = `intent://${path}#Intent;scheme=${scheme};package=${destination.androidPackage};S.browser_fallback_url=${encodeURIComponent(installUrl)};end`;
    }
    return { name: destination.name, href, installUrl, target: platform === "desktop" ? "_blank" : "_self" };
  }

  return {
    grab: resolve(destinations.grab), shopee: resolve(destinations.shopee),
    be: resolve(destinations.be), xanh: resolve(destinations.xanh), maps: resolve(destinations.maps),
  };
}
