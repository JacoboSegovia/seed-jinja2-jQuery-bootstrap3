from staticjinja import make_site
import context_vars.context_list as context

if __name__ == "__main__":

  renderer = make_site(searchpath='./app/templates', outpath="./app/dist", contexts=context.get_context_list())
  renderer.render()
