design-capture:
	node scripts/design-workflow.mjs capture

design-review:
	node scripts/design-workflow.mjs review --exec

design-review-interactive:
	node scripts/design-workflow.mjs review

design-review-save:
	node scripts/design-workflow.mjs review --exec

design-apply:
	node scripts/design-workflow.mjs apply --prepare

design-status:
	node scripts/design-workflow.mjs status

design-loop: design-capture design-review
