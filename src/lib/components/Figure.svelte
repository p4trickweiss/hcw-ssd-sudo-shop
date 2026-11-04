<script lang="ts">
	let { color = 'cream', small = false }: { color?: string; small?: boolean } = $props();
</script>

<div class="figure-stage {color}" class:small>
	<svg viewBox="0 0 240 240" fill="none" aria-hidden="true">
		<ellipse cx="120" cy="214" rx="55" ry="9" fill="currentColor" opacity=".1" />
		<path
			d="M83 79C62 45 67 14 82 20C96 25 99 56 100 77M140 77C141 56 144 25 158 20C173 14 178 45 157 79"
			fill="var(--fur)"
			stroke="var(--outline)"
			stroke-width="3"
		/>
		<path
			d="M84 65C78 48 78 36 82 34M155 65C161 48 161 36 157 34"
			stroke="var(--inner)"
			stroke-width="8"
			stroke-linecap="round"
		/>
		<path
			d="M84 152C66 156 61 179 68 184C76 189 85 177 89 174M156 152C174 156 179 179 172 184C164 189 155 177 151 174"
			fill="var(--fur)"
			stroke="var(--outline)"
			stroke-width="3"
		/>
		<path
			d="M87 148Q72 172 87 200L88 211Q100 217 111 210L114 198H126L129 210Q140 217 152 211L153 200Q168 172 153 148"
			fill="var(--fur)"
			stroke="var(--outline)"
			stroke-width="3"
		/>
		<ellipse cx="120" cy="176" rx="20" ry="22" fill="var(--face)" opacity=".8" />
		<path
			d="M72 91L66 85L65 102L57 104L65 117L59 127L71 132C74 155 96 165 120 165C144 165 166 155 169 132L181 127L175 117L183 104L175 102L174 85L168 91C161 68 79 68 72 91Z"
			fill="var(--fur)"
			stroke="var(--outline)"
			stroke-width="3"
			stroke-linejoin="round"
		/>
		<ellipse cx="120" cy="119" rx="43" ry="34" fill="var(--face)" />
		<ellipse cx="101" cy="110" rx="8" ry="10" fill="#332b2a" /><ellipse
			cx="139"
			cy="110"
			rx="8"
			ry="10"
			fill="#332b2a"
		/>
		<circle cx="103" cy="107" r="2.5" fill="white" /><circle
			cx="141"
			cy="107"
			r="2.5"
			fill="white"
		/>
		<path d="M115 119Q120 124 125 119" stroke="#715044" stroke-width="3" stroke-linecap="round" />
		<path d="M95 130Q120 150 145 130Z" fill="#563c36" /><path
			d="M100 132L105 138L110 134L115 141L120 136L125 141L130 134L135 138L140 132"
			fill="white"
		/>
		<ellipse cx="88" cy="123" rx="7" ry="4" fill="#efaca0" opacity=".6" /><ellipse
			cx="152"
			cy="123"
			rx="7"
			ry="4"
			fill="#efaca0"
			opacity=".6"
		/>
	</svg>
	<span class="sparkle one">✦</span><span class="sparkle two">✧</span>
</div>
