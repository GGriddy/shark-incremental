function calc(dt) {
    for (let [i,v] of Object.entries(CURRENCIES)) {
        var passive = v.passive ?? 1
        gainCurrency(i, tmp.currency_gain[i].mul(dt*passive))
    }

    let p = PROGRESS[player.feature]

    if (p && p.auto && p.amount.gte(p.require)) player.feature++

    for (let [i,v] of Object.entries(AUTOMATION)) {
        let a = player.auto[i], [I,D] = v.interval
        if (a[1] && v.unl()) {
            let s = Math.max(AUTO_MIN_INTERVAL,I*D**a[0])
            let t = auto_time[i] + dt
            if (t >= s) {
                t %= s
                v.trigger()
            }
            auto_time[i] = t
        }
        else auto_time[i] = 0
    }

    if (player.feature >= 4) {
        let u = player.explore.unl
        if (EXPLORE[u] && player.shark_level.gte(EXPLORE[u].level_req)) player.explore.unl++

        if (player.explore.active > -1) player.explore.best_fish = player.explore.best_fish.max(player.fish)

        for (let i in EXPLORE) {
            i = parseInt(i)
            if (u > i) player.explore.depth[i] = calcNextDepth(player.explore.depth[i], tmp.depth_gain[i].mul(dt)).min(EXPLORE[i].maxDepth)
            if (player.research.e3.toNumber() > i) player.explore.base[i] = player.explore.base[i].max(getBaseExploration(i,player.fish))
        }
    }

    if (player.feature >= 7) {
        var rad = player.core.radiation

        if (rad.amount.lt(tmp.cr_limit)) rad.amount = rad.amount.add(tmp.cr_gain.mul(dt)).min(tmp.cr_limit)
    }

    player.latest_time = Date.now()
}