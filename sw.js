const CACHE_NAME = "flag-guessr-v4";

const CORE_ASSETS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./data/countries.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png",

    "./audio/correct.mp3",
    "./audio/mid.mp3",
    "./audio/red_flag.mp3",
    "./audio/victory.mp3",
    "./audio/wrong.mp3"
];

const FLAG_ASSETS = [
    "./flags/ad.svg",
    "./flags/ae.svg",
    "./flags/af.svg",
    "./flags/ag.svg",
    "./flags/ai.svg",
    "./flags/al.svg",
    "./flags/am.svg",
    "./flags/ao.svg",
    "./flags/aq.svg",
    "./flags/ar.svg",
    "./flags/as.svg",
    "./flags/at.svg",
    "./flags/au.svg",
    "./flags/aw.svg",
    "./flags/ax.svg",
    "./flags/az.svg",
    "./flags/ba.svg",
    "./flags/bb.svg",
    "./flags/bd.svg",
    "./flags/be.svg",
    "./flags/bf.svg",
    "./flags/bg.svg",
    "./flags/bh.svg",
    "./flags/bi.svg",
    "./flags/bj.svg",
    "./flags/bl.svg",
    "./flags/bm.svg",
    "./flags/bn.svg",
    "./flags/bo.svg",
    "./flags/bq.svg",
    "./flags/br.svg",
    "./flags/bs.svg",
    "./flags/bt.svg",
    "./flags/bv.svg",
    "./flags/bw.svg",
    "./flags/by.svg",
    "./flags/bz.svg",
    "./flags/ca.svg",
    "./flags/cc.svg",
    "./flags/cd.svg",
    "./flags/cf.svg",
    "./flags/cg.svg",
    "./flags/ch.svg",
    "./flags/ci.svg",
    "./flags/ck.svg",
    "./flags/cl.svg",
    "./flags/cm.svg",
    "./flags/cn.svg",
    "./flags/co.svg",
    "./flags/cr.svg",
    "./flags/cu.svg",
    "./flags/cv.svg",
    "./flags/cw.svg",
    "./flags/cx.svg",
    "./flags/cy.svg",
    "./flags/cz.svg",
    "./flags/de.svg",
    "./flags/dj.svg",
    "./flags/dk.svg",
    "./flags/dm.svg",
    "./flags/do.svg",
    "./flags/dz.svg",
    "./flags/ec.svg",
    "./flags/ee.svg",
    "./flags/eg.svg",
    "./flags/eh.svg",
    "./flags/er.svg",
    "./flags/es.svg",
    "./flags/et.svg",
    "./flags/fi.svg",
    "./flags/fj.svg",
    "./flags/fk.svg",
    "./flags/fm.svg",
    "./flags/fo.svg",
    "./flags/fr.svg",
    "./flags/ga.svg",
    "./flags/gb-eng.svg",
    "./flags/gb-nir.svg",
    "./flags/gb-sct.svg",
    "./flags/gb-wls.svg",
    "./flags/gb.svg",
    "./flags/gd.svg",
    "./flags/ge.svg",
    "./flags/gf.svg",
    "./flags/gg.svg",
    "./flags/gh.svg",
    "./flags/gi.svg",
    "./flags/gl.svg",
    "./flags/gm.svg",
    "./flags/gn.svg",
    "./flags/gp.svg",
    "./flags/gq.svg",
    "./flags/gr.svg",
    "./flags/gs.svg",
    "./flags/gt.svg",
    "./flags/gu.svg",
    "./flags/gw.svg",
    "./flags/gy.svg",
    "./flags/hk.svg",
    "./flags/hm.svg",
    "./flags/hn.svg",
    "./flags/hr.svg",
    "./flags/ht.svg",
    "./flags/hu.svg",
    "./flags/id.svg",
    "./flags/ie.svg",
    "./flags/il.svg",
    "./flags/im.svg",
    "./flags/in.svg",
    "./flags/io.svg",
    "./flags/iq.svg",
    "./flags/ir.svg",
    "./flags/is.svg",
    "./flags/it.svg",
    "./flags/je.svg",
    "./flags/jm.svg",
    "./flags/jo.svg",
    "./flags/jp.svg",
    "./flags/ke.svg",
    "./flags/kg.svg",
    "./flags/kh.svg",
    "./flags/ki.svg",
    "./flags/km.svg",
    "./flags/kn.svg",
    "./flags/kp.svg",
    "./flags/kr.svg",
    "./flags/kw.svg",
    "./flags/ky.svg",
    "./flags/kz.svg",
    "./flags/la.svg",
    "./flags/lb.svg",
    "./flags/lc.svg",
    "./flags/li.svg",
    "./flags/lk.svg",
    "./flags/lr.svg",
    "./flags/ls.svg",
    "./flags/lt.svg",
    "./flags/lu.svg",
    "./flags/lv.svg",
    "./flags/ly.svg",
    "./flags/ma.svg",
    "./flags/mc.svg",
    "./flags/md.svg",
    "./flags/me.svg",
    "./flags/mf.svg",
    "./flags/mg.svg",
    "./flags/mh.svg",
    "./flags/mk.svg",
    "./flags/ml.svg",
    "./flags/mm.svg",
    "./flags/mn.svg",
    "./flags/mo.svg",
    "./flags/mp.svg",
    "./flags/mq.svg",
    "./flags/mr.svg",
    "./flags/ms.svg",
    "./flags/mt.svg",
    "./flags/mu.svg",
    "./flags/mv.svg",
    "./flags/mw.svg",
    "./flags/mx.svg",
    "./flags/my.svg",
    "./flags/mz.svg",
    "./flags/na.svg",
    "./flags/nc.svg",
    "./flags/ne.svg",
    "./flags/nf.svg",
    "./flags/ng.svg",
    "./flags/ni.svg",
    "./flags/nl.svg",
    "./flags/no.svg",
    "./flags/np.svg",
    "./flags/nr.svg",
    "./flags/nu.svg",
    "./flags/nz.svg",
    "./flags/om.svg",
    "./flags/pa.svg",
    "./flags/pe.svg",
    "./flags/pf.svg",
    "./flags/pg.svg",
    "./flags/ph.svg",
    "./flags/pk.svg",
    "./flags/pl.svg",
    "./flags/pm.svg",
    "./flags/pn.svg",
    "./flags/pr.svg",
    "./flags/ps.svg",
    "./flags/pt.svg",
    "./flags/pw.svg",
    "./flags/py.svg",
    "./flags/qa.svg",
    "./flags/re.svg",
    "./flags/ro.svg",
    "./flags/rs.svg",
    "./flags/ru.svg",
    "./flags/rw.svg",
    "./flags/sa.svg",
    "./flags/sb.svg",
    "./flags/sc.svg",
    "./flags/sd.svg",
    "./flags/se.svg",
    "./flags/sg.svg",
    "./flags/sh.svg",
    "./flags/si.svg",
    "./flags/sj.svg",
    "./flags/sk.svg",
    "./flags/sl.svg",
    "./flags/sm.svg",
    "./flags/sn.svg",
    "./flags/so.svg",
    "./flags/sr.svg",
    "./flags/ss.svg",
    "./flags/st.svg",
    "./flags/sv.svg",
    "./flags/sx.svg",
    "./flags/sy.svg",
    "./flags/sz.svg",
    "./flags/tc.svg",
    "./flags/td.svg",
    "./flags/tf.svg",
    "./flags/tg.svg",
    "./flags/th.svg",
    "./flags/tj.svg",
    "./flags/tk.svg",
    "./flags/tl.svg",
    "./flags/tm.svg",
    "./flags/tn.svg",
    "./flags/to.svg",
    "./flags/tr.svg",
    "./flags/tt.svg",
    "./flags/tv.svg",
    "./flags/tw.svg",
    "./flags/tz.svg",
    "./flags/ua.svg",
    "./flags/ug.svg",
    "./flags/um.svg",
    "./flags/us.svg",
    "./flags/uy.svg",
    "./flags/uz.svg",
    "./flags/va.svg",
    "./flags/vc.svg",
    "./flags/ve.svg",
    "./flags/vg.svg",
    "./flags/vi.svg",
    "./flags/vn.svg",
    "./flags/vu.svg",
    "./flags/wf.svg",
    "./flags/ws.svg",
    "./flags/xk.svg",
    "./flags/ye.svg",
    "./flags/yt.svg",
    "./flags/za.svg",
    "./flags/zm.svg",
    "./flags/zw.svg"
];


// ================================
// INSTALL
// ================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(async cache => {

                console.log("Caching core assets...");

                // Cache the essential game files first
                await cache.addAll(CORE_ASSETS);

                console.log("Core assets cached.");

                // Cache every flag individually
                for (const flag of FLAG_ASSETS) {

                    try {

                        await cache.add(flag);

                        console.log("Cached:", flag);

                    } catch (error) {

                        console.error(
                            "Failed to cache:",
                            flag,
                            error
                        );

                    }

                }

                console.log("Flag Guessr cache complete.");

            })

    );

    self.skipWaiting();
});


// ================================
// ACTIVATE
// ================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


// ================================
// FETCH
// ================================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request, {
            ignoreSearch: true
        })
        .then(cachedResponse => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);

        })
        .catch(() => {

            return new Response(
                "Offline",
                {
                    status: 503,
                    statusText: "Offline"
                }
            );

        })

    );

});