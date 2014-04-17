var ezLanguages = ezLanguages || {};

ezLanguages['en'] = {
	// Social links
	"social+facebook":   "Follow us on Facebook",
	"social+twitter":    "Follow us on Twitter",
	"social+googleplus": "Follow us on Google+",
	"social+mail":       "Contact us at {{ mail }}",

	// login page
	"login+signin":                  "Sign in",
	"login+signup":                  "Sign up",
	"login+checking_users":          "Checking users...",
	"login+install_successful":      "Install successful !",
	"login+set_admin_account":       "Sign up now to set administrator account.",
	"login+register_quick_and_easy": "Sign up before processing your logs, it's quick and easy.<br/>Then you'll be able to track your jobs and communicate more easily with the ezPAARSE team.",
	"login+ezpaarse_is":             "ezPAARSE, it's...",
	"login+ezpaarse_description":    "an <a href=\"{{ github }}\">open-source software</a> that can ingest and analyse your (proxy) log files and show how users access suscribed electronic ressources. It filters, extracts and enriches the consultation events that were spotted and produces a CSV file following COUNTER codes of practice.",
	"login+simple_tool":             "A simple and effective tool",
	"login+few_clic_enough":         "A few clicks are enough to install it and start analyzing your logs.",
	"login+responsive_team":         "A highly available and responsive team",
	"login+problem_question":        "Problem, question, suggestion ?",
	"login+interested":              "We're interested !",
	"login+growing_community":       "A growing community",
	"login+not_only_fr":             "Not only French-speaking !",
	"login+connecting":              "Connecting...",
	"login+error":           	 "Error",
	"login+identifier":           	 "Identifier",
	"login+email":           	 "Email address",
	"login+password":        	 "Password",
	"login+confirm":        	 "Confirm your password",
	"login+rememberme":      	 "Remember me",
	"login+cancel":         	 "Cancel",
	"login+submitting":         	 "Submitting...",

	// Slides on the login page
	"slider+raw_material":      "The raw material: your logs",
	"slider+use_this_way":      "Which can be used this way !",
	"slider+drag_drop":         "Drag and drop your files to process them",
	"slider+real_time_process": "Your logs are processed in real time",
	"slider+progress":          "You're informed about the progress",
	"slider+click_to_dl":       "Just click to download the result",
	"slider+many_informations": "The result contains many informations",
	"slider+many_platforms":    "Many editor platforms are handlded by ezPAARSE.",
	"slider+renders":           "LibreOffice and Excel renders are available for graphically displaying the results",
	"slider+render_example":    "LibreOffice rendering example : succssful accesses per title",

	// Layout
	"menu+admin":         "Administration",
	"menu+logout":        "Logout",
	"menu+process_logs":  "Process your logs",
	"menu+documentation": "Documentation",
	"footer+powered":     "Powered by <a href=\"{{ nodejs }}\" target=\"_blank\">Node.js</a> and <a href=\"{{ expressjs }}\" target=\"_blank\">Express 3</a>",

	// Form page
	"form+title":             "Prepare the data to be processed",
	"form+description":       "Select the logfiles you wish to process. Your logfiles may need setting some parameters to be properly analysed with ezPAARSE. If you need help, you can <a ez-toggle-sidebar=\"{{ sidebarID }}\">contact the ezPAARSE team</a>.",
	"form+settings":          "Parameters",
	"form+logfiles":          "Logfiles",
	"form+copy_paste":        "Copy/Paste logs",
	"form+autosort":          "autosort",
	"form+drop_files_here":   "Drag and drop your files here",
	"form+click_to_add":      "Click to add",
	"form+filename":          "Filename",
	"form+size":              "Size",
	"form+n_selected_files":  "{{ number }} selected files",
	"form+total_size":        "{{ size | bytesToSize }} (total)",
	"form+process_files":     "Process the files",
	"form+process_with_curl": "Process with cURL",
	"form+paste_your_logs":   "Copy/paste your log lines here",
	"form+process_lines":     "Process the lines",
	"form+curl_instructions": "Copy the following command to run the query with cURL using the current setting of the form. You may need to change the file path or add options like <code>--proxy</code> or <code>--no-buffer</code>.",

	// Settings tab
	"settings+loading_predefined":   "Load a predefined set of parameters",
	"settings+modified":             "modified",
	"settings+predefined_choice":    "Chose a predefined set of parameters...",
	"settings+no_result_for":        "No result for",
	"settings+default":              "default",
	"settings+input":                "Input",
	"settings+output":               "Output",
	"settings+date_format":          "Date format",
	"settings+date_format_help":     "Date format of the log lines.",
	"settings+relative_domain":      "Relative domaine",
	"settings+relative_domain_help": "Set a relative domain for the truncated URLs.",
	"settings+log_type":             "Log type",
	"settings+auto_recognition":     "Auto recognition",
	"settings+log_type_help":        "Plateform from which the logs come from",
	"settings+log_format":           "Log format",
	"settings+log_format_help":      "Log format (Eg: '%h %l %u %t %s %b'). <a href='{{ docURL }}' target='_blank'>Learn more</a>",
	"settings+result_format":        "Result format",
	"settings+result_format_help":   "Format for the resulting data",
	"settings+system_traces":        "System traces",
	"settings+system_traces_help":   "Verbosity level for the traces left duribg the processing.",
	"settings+output_fields":        "Output fields",
	"settings+output_fields_add":    "Add...",
	"settings+output_fields_remove": "Remove...",
	"settings+output_fields_help":   "Fields (headers) to add/remove from the result file.",
	"settings+new":                  "New",
	"settings+headers":              "Headers (advanced)",
	"settings+headers_help":         "Headers list to add to the request. If a header duplicates an option in the form, the option is overwritten.",
	"settings+remember":             "Remember my parameters",
	"settings+reset":                "Reset parameters",
	"settings+name":                 "Name",
	"settings+value":                "Value",

	// Feedback sidebar
	"feedback+title":             "Feedback",
	"feedback+subtitle":          "Your opinion matters !",
	"feedback+address":           "Your adress",
	"feedback+email":             "E-Mail",
	"feedback+comment":           "Your comment",
	"feedback+what_do_you_think": "What do you think about ezPAARSE?",
	"feedback+send":              "Send",

	// Process page
	"process+title": "Processing",
	"process+description": "Your logs are being processed by ezPAARSE. You can follow the processing and the different reject types in realtime",
	"process+done": "Done",
	"process+error": "Error", //TODO finalisation
	"process+cancelled": "Canceled",
	"process+download": "Download the result",
	"process+can_start_download": "You can already start downloading the results",
	"process+cancel": "Abort",
	"process+state": "Process state",
	"process+rejects": "Rejects",
	"process+system_traces": "System traces",
	"process+report": "Report",

	// Process page -> metrics tab
	"metrics+read_lines": "Read lines",
	"metrics+generated_ecs": "Generated <popup data-variation=\"inverted\" data-content=\"Consultation events\">CEs</popup>",
	"metrics+duration": "Processing lasted",
	"metrics+speed": "Speed",
	"metrics+platforms_count": "Recognized platforms count",
	"metrics+html_count": "HTML accesses",
	"metrics+pdf_count": "PDF accesses",

	// Process page -> rejects tab
	"rejects+ignored_lines":         "Ignored Lines",
	"rejects+denied_ecs":            "Denied access CEs",
	"rejects+duplicates":            "Duplicates",
	"rejects+chrono_anomalies":      "Chronological anomalies",
	"rejects+ignored_domains":       "Ignored domains",
	"rejects+unknown_domains":       "Unknown domains",
	"rejects+unknown_formats":       "Unknown formats",
	"rejects+unqualified_ecs":       "Unqualified CEs",
	"rejects+missing_pkbs":          "Missing PKBs",
	"rejects+relevant_lines":        "Relevant log lines read: {{ nb | localNumber }}",
	"rejects+ignored_lines_help":    "Number of non relevant requests. They are mainly downloaded images, css or web scripts that are not directly related to a resource. In a raw log, this figure is often high.",
	"rejects+denied_ecs_help":       "List of accesses that were denied to the user when a click was performed.<br/>Example: a user tried to access a resource that is not included in the package negociated by its instituion.",
	"rejects+duplicates_help":       "Number of ignored accesses because identified as double-clicks",
	"rejects+chrono_anomalies_help": "Lines that were ignored because they are not chronologically ordered in the log file.",
	"rejects+ignored_domains_help":  "The ignored domains.",
	"rejects+unknown_domains_help":  "The unknown domains.",
	"rejects+unknown_formats_help":  "The unknown formats",
	"rejects+unqualified_ecs_help":  "The parsers were not able to recognize bibliographical data in the URLs of those loglines. They are thus ignored by ezPAARSE.",
	"rejects+missing_pkbs_help":     "The missing PKBs.",

	// Report (tab and fullpage)
	"report+title": 	 "Processing report",
	"report+subtitle": 	 "Generated on {{ date | date:\"dd-MM-yyyy 'at' HH:mm\" }}",
	"report+view_full_page": "View the report in full screen",
	"report+general":        "General",
	"report+rejets":         "Rejects",
	"report+dedoublonnage":  "Duplicates",
	"report+stats":          "Statistics",
	"report+files": 	 "Files",
	"report+system_traces":  "System traces",
	"report+loading":  	 "Loading...",
	"report+goto":  	 "Go to :",
	"report+report_fail":    "Failed to retrieve the report...",
	"report+fail_cause_1":   "Have you specified an identifier?",
	"report+fail_cause_2":   "Is the associated process recent?",
	"report+traces_fail":  	 "Failed to retrieve the traces",

	// Admin page
	"admin+title":             "Administration",
	"admin+repositories":      "Repositories",
	"admin+unknown_state":     "Unknwon state",
	"admin+updates_available": "Updates available",
	"admin+update":            "Update",
	"admin+pkb_state":         "Publisher Knowledge Bases' state",
	"admin+pkb_uptodate":      "The base is up-to-date",
	"admin+parsers_state":     "Parsers' state",
	"admin+parsers_uptodate":  "The parsers are up-to-date",
	"admin+users":             "Users",
	"admin+get_users_fail":    "The users could not be retrieved",
	"admin+name":              "Name",
	"admin+group":             "Group",
	"admin+remove":            "Remove",
	"admin+password":          "Password"
};
