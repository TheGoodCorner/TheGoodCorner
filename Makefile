# -------------------------------------------------- #
#                   VARIABLES                        #
# -------------------------------------------------- #

NAME				= inception
BACK_CONT			= back
DATABASE_CONT		= database
WEB_SERVER_CONT		= webserver
SRC_DIR				= srcs
COMPOSE				= docker compose
CONF				= ./docker-compose.yml

# -------------------------------------------------- #
# 					MARKDOWN						 #
# -------------------------------------------------- #
define MARKDOWN
@if [ -f README.md ]; then \
	code --command "markdown.showPreview" README.md 2>/dev/null; \
else \
	echo "No README.md found."; \
fi
endef

# -------------------------------------------------- #
# 					COLORS							 #
# -------------------------------------------------- #

GREEN		:=	\033[1;32m
YELLOW		:=	\033[1;33m
BLUE		:=	\033[1;34m
RED			:=	\033[1;31m
BEIGE		:=	\033[1;38;5;229m
BROWN		:=	\033[0;38;5;94m
DARK_BLUE	:=	\033[0;38;5;17m
DARK_GREY	:=	\033[0;38;5;238m
RESET		:=	\033[0m

# -------------------------------------------------- #
#                   BUILD RULES                      #
# -------------------------------------------------- #

all: up launch

up:
	
	@if [ $$(docker ps -q -f name=$(WEB_SERVER_CONT) | wc -l ) -gt 0 ]; then \
		echo -e "$(RED)Inception is already up."; \
	else \
		echo -e "$(YELLOW)Starting $(NAME) $(RESET)"; \
		mkdir -p /home/$$USER/data/postgresql; \
		$(COMPOSE) -f $(CONF) up --build -d; \
		echo -e "$(GREEN)[DONE]$(RESET) $(NAME) is running."; \
	fi

down:
	@echo -e "$(RED)Stopping $(NAME)... if there are volumes they stays mounted $(RESET)"
	@$(COMPOSE) -f $(CONF) down 2>/dev/null
	@echo -e "$(BLUE)[DONE]$(RESET) $(NAME) stopped."

refresh: down up
	@echo -e "\n$(BLUE)Refresh done !\n";

launch:
# 	$(MARKDOWN)
	@echo -e "\n$(BLUE)Here's a list of basic commands to get you started :$(GREEN)\n";
	@echo -e "- docker compose -f ./srcs/docker-compose.yaml ps ([service name])";
	@echo -e "- docker compose -f ./srcs/docker-compose.yaml logs -f ([service name]) $(RESET)\n";

clean: down
	@echo -e "$(YELLOW)Cleaning Docker system...$(RESET)"
	@docker system prune -a -f
	@echo -e "$(BLUE)[DONE]$(RESET) Full clean complete."

re: clean all

back:

	@if [ $$(docker ps -q -f name=back | wc -l ) -gt 0 ]; then \
		echo -e "$(RED)back container is already up refreshing. $(RESET)"; \
		$(COMPOSE) -f $(CONF) up -d --build --force-recreate $(BACK_CONT); \
	else \
		echo -e "$(YELLOW)Starting $(BACK_CONT) $(RESET)"; \
			$(COMPOSE) -f $(CONF) up -d $(BACK_CONT) 2>/dev/null; \
		echo -e "$(GREEN)[DONE]$(RESET) $(BACK_CONT) is running."; \
	fi
database:

	@if [ $$(docker ps -q -f name=database | wc -l ) -gt 0 ]; then \
		echo -e "$(RED)database container is already up refreshing. $(RESET)"; \
		$(COMPOSE) -f $(CONF) up -d --build --force-recreate $(DATABASE_CONT); \
	else \
		echo -e "$(YELLOW)Starting $(DATABASE_CONT) $(RESET)"; \
			$(COMPOSE) -f $(CONF) up -d $(DATABASE_CONT) 2>/dev/null; \
		echo -e "$(GREEN)[DONE]$(RESET) $(DATABASE_CONT) is running."; \
	fi
webserver:

	@if [ $$(docker ps -q -f name=webserver | wc -l ) -gt 0 ]; then \
		echo -e "$(RED)webserver container is already up refreshing. $(RESET)"; \
		$(COMPOSE) -f $(CONF) up -d --build --force-recreate $(WEB_SERVER_CONT); \
	else \
		echo -e "$(YELLOW)Starting $(WEB_SERVER_CONT) $(RESET)"; \
			$(COMPOSE) -f $(CONF) up -d $(WEB_SERVER_CONT) 2>/dev/null; \
		echo -e "$(GREEN)[DONE]$(RESET) $(WEB_SERVER_CONT) is running."; \
	fi

.PHONY: all up down back database webserver clean re