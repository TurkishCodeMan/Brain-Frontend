<script >
import { inject, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { isDark, useDarkModeHandler } from "@/composable/useDarkModeHandler";
import useNotyf from "@/composable/useNotyf";
import { useAsync } from "@/composable/useAsync";
import { Icon } from "@iconify/vue";

export default {
  components: { Icon },
  async setup() {
    const { data, error, status, isLoading, run, setData } = useAsync();

    const step = ref("login");

    const form = reactive({
      username: "",
      password: "",
    });

    const router = useRouter();
    const route = useRoute();
    const notif = useNotyf();
    //const userSession = useUserSession();
    const redirect = route.query.redirect;
    const loginHandler = inject("login");

    const handleLogin = async () => {
      await run(new Promise((res) => res(loginHandler(form))));
    };

    useHead({
      title: "Login",
    });

    return {
      form,
      handleLogin,
      useDarkModeHandler,
      isDark,
      step,
      isLoading,
    };
  },
};
</script>

<template>
  <div class="modern-login">
    <div class="underlay h-hidden-mobile h-hidden-tablet-p"></div>
    <div class="columns is-gapless is-vcentered">
      <div class="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p">
        <div class="hero is-fullheight is-image">
          <div class="hero-body">
            <div class="container">
              <div class="columns">
                <div class="column"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4 is-relative">
        <RouterLink :to="{ name: 'Home' }" class="top-logo"> </RouterLink>

        <label class="dark-mode ml-auto">
          <input
            type="checkbox"
            :checked="!isDark"
            @change="useDarkModeHandler"
          />
          <span></span>
        </label>
        <div class="is-form">
          <div class="hero-body">
            <div class="form-text">
              <h2>Sign In</h2>

              <p>Welcome back to your account.</p>
            </div>
            <div class="form-text is-hidden">
              <h2>Recover Account</h2>
              <p>Reset your account password.</p>
            </div>
            <form
              :class="[step !== 'login' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="handleLogin"
            >
              <div class="control has-validation">
                <input
                  type="text"
                  name="username"
                  class="input"
                  placeholder=""
                  autocomplete="username"
                  v-model="form.username"
                />
                <small class="error-text">This is a required field</small>
                <div class="auth-label">Username</div>
                <div class="autv-icon">
                  <i aria-hidden="true" class="lnil lnil-envelope"></i>
                </div>
              </div>
              <div class="control has-validation">
                <input
                  name="password"
                  type="password"
                  class="input"
                  autocomplete="current-password"
                  v-model="form.password"
                />
                <div class="auth-label">Password</div>
                <div class="autv-icon">
                  <i aria-hidden="true" class="lnil lnil-lock-alt"></i>
                </div>
              </div>

              <div class="control is-flex">
                <label class="remember-toggle">
                  <input type="checkbox" />
                  <span class="toggler">
                    <span class="active">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:check"
                      ></i>
                    </span>
                    <span class="inactive">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      ></i>
                    </span>
                  </span>
                </label>
                <div class="remember-me">Remember Me</div>
                <a @click="step = 'forgot-password'">Forgot Password?</a>
              </div>
              <div class="button-wrap has-help">
                <button
                  class="
                    bg-green-300
                    p-4
                    rounded-md
                    text-gray-600
                    flex
                    items-center
                  "
                >
                  Login
                  <Icon
                    v-show="isLoading"
                    icon="feather:rotate-ccw"
                    color="green"
                    :rotate="1"
                    width="24"
                    style="
                      animation: spin 1s linear infinite;
                      background-color: transparent;
                      margin-left: 4px;
                    "
                    :horizontalFlip="true"
                  />
                </button>

                <span>
                  Or
                  <button @click="$emit('goRegister')"> Create </button>
                  an account.
                </span>
              </div>
            </form>

            <form
              :class="[step !== 'forgot-password' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent
            >
              <p class="recover-text">
                Enter your username and click on the confirm button to reset
                your password. We'll send you an username detailing the steps to
                complete the procedure.
              </p>
              <div class="control has-validation">
                <input type="text" class="input" autocomplete="username" />
                <small class="error-text">This is a required field</small>
                <div class="auth-label">username Address</div>
                <div class="autv-icon">
                  <i aria-hidden="true" class="lnil lnil-envelope"></i>
                </div>
              </div>
              <div class="button-wrap">
                <button
                  color="white"
                  size="big"
                  lower
                  rounded
                  @click="step = 'login'"
                >
                  Cancel
                </button>
                <button
                  color="primary"
                  size="big"
                  type="submit"
                  lower
                  rounded
                  solid
                  @click="step = 'login'"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./scss/abstracts/_mixins.scss";

.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

  .column {
    &.is-relative {
      position: relative;
    }
  }

  .hero {
    &.has-background-image {
      position: relative;

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #5d4298 !important;
        opacity: 0.6;
      }
    }
  }

  .underlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 66.6%;
    height: 100%;
    background: #fdfdfd;
    z-index: 0;
  }

  .dark-mode {
    position: absolute;
    top: -64px;
    right: 38px;
    transform: scale(0.6);
    z-index: 2;
  }

  .top-logo {
    position: absolute;
    top: -70px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    img {
      display: block;
      width: 100%;
      max-width: 50px;
      margin: 0 auto;
    }

    svg {
      height: 50px;
      width: 50px;
    }
  }

  .is-image {
    position: relative;
    border-right: 1px solid var(--fade-grey);

    .hero-image {
      position: relative;
      z-index: 2;
      display: block;
      margin: -80px auto 0 auto;
      max-width: 60%;
      width: 60%;
    }
  }

  .is-form {
    position: relative;
    max-width: 420px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      padding: 0 20px;
      animation: fadeInLeft 0.5s;

      h2 {
        font-family: var(--font-alt);
        font-weight: 400;
        font-size: 2rem;
        color: var(--primary);
      }

      p {
        color: var(--muted-grey);
        margin-top: 10px;
      }
    }

    .recover-text {
      font-size: 0.9rem;
      color: var(--dark-text);
    }

    .login-wrapper {
      padding: 30px 20px;

      .control {
        position: relative;
        width: 100%;
        margin-top: 16px;

        .input {
          padding-top: 14px;
          height: 60px;
          border-radius: 10px;
          padding-left: 55px;
          transition: all 0.3s;

          &:focus {
            background: var(--fade-grey-light-6);
            border-color: var(--placeholder);

            ~ .auth-label,
            ~ .autv-icon i {
              color: var(--muted-grey);
            }
          }
        }

        .error-text {
          color: var(--danger);
          font-size: 0.8rem;
          display: none;
          padding: 2px 6px;
        }

        .auth-label {
          position: absolute;
          top: 6px;
          left: 55px;
          font-size: 0.8rem;
          color: var(--dark-text);
          font-weight: 500;
          z-index: 2;
          transition: all 0.3s;
        }

        .autv-icon {
          position: absolute;
          top: 0;
          left: 0;
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            font-size: 24px;
            color: var(--placeholder);
            transition: all 0.3s;
          }
        }

        &.has-validation {
          .validation-icon {
            position: absolute;
            top: 0;
            right: 0;
            height: 60px;
            width: 60px;
            display: none;
            justify-content: center;
            align-items: center;

            .icon-wrapper {
              height: 20px;
              width: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: var(--radius-rounded);

              svg {
                height: 10px;
                width: 10px;
                stroke-width: 3px;
                color: var(--white);
              }
            }

            &.is-success {
              .icon-wrapper {
                background: var(--success);
              }
            }

            &.is-error {
              .icon-wrapper {
                background: var(--danger);
              }
            }
          }

          &.has-success {
            .validation-icon {
              &.is-success {
                display: flex;
              }

              &.is-error {
                display: none;
              }
            }
          }

          &.has-error {
            .input {
              border-color: var(--danger);
            }

            .error-text {
              display: block;
            }

            .validation-icon {
              &.is-error {
                display: flex;
              }

              &.is-success {
                display: none;
              }
            }
          }
        }

        &.is-flex {
          display: flex;
          align-items: center;

          a {
            display: block;
            margin-left: auto;
            color: var(--muted-grey);
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover {
              color: var(--primary);
            }
          }

          .remember-me {
            font-size: 0.9rem;
            color: var(--muted-grey);
            font-weight: 500;
          }
        }
      }

      .button-wrap {
        margin: 40px 0;

        &.has-help {
          display: flex;
          align-items: center;

          > span {
            margin-left: 12px;
            font-family: var(--font);

            a {
              color: var(--primary);
              font-weight: 500;
              padding: 0 2px;
            }
          }
        }

        .button {
          height: 46px;
          width: 140px;
          margin-left: 6px;

          &:first-child {
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}

.remember-toggle {
  width: 65px;
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transform: scale(0.9);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .active,
      .inactive {
        transform: translateX(100%) rotate(360deg);
      }

      .active {
        opacity: 1;
      }

      .inactive {
        opacity: 0;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 34px;
    width: 61px;
    border: 2px solid var(--placeholder);
    border-radius: 100px;
    transition: all 0.3s;

    .active,
    .inactive {
      position: absolute;
      top: 2px;
      left: 2px;
      height: 26px;
      width: 26px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(0) rotate(0);
      transition: all 0.3s ease;

      svg {
        color: var(--white);
        height: 14px;
        width: 14px;
        stroke-width: 3px;
      }
    }

    .inactive {
      background: var(--placeholder);
      border-color: var(--placeholder);
      opacity: 1;
      z-index: 1;
    }

    .active {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;
    }
  }
}

@media only screen and (max-width: 767px) {
  .modern-login {
    .top-logo {
      top: 30px;
    }

    .dark-mode {
      top: 36px;
      right: 44px;
    }

    .is-form {
      padding-top: 100px;
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      right: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }
}

/* ==========================================================================
Dark mode
========================================================================== */

.is-dark {
  .modern-login {
    background: var(--dark-sidebar);

    .underlay {
      background: var(--dark-sidebar-light-10);
    }

    .is-image {
      border-color: var(--dark-sidebar-light-10);
    }

    .is-form {
      .form-text {
        h2 {
          color: var(--primary);
        }
      }

      .login-wrapper {
        .control {
          &.is-flex {
            a:hover {
              color: var(--primary);
            }
          }

          .input {
            background: var(--dark-sidebar-light-4);

            &:focus {
              border-color: var(--primary);

              ~ .autv-icon {
                i {
                  color: var(--primary);
                }
              }
            }
          }

          .auth-label {
            color: var(--light-text);
          }
        }

        .button-wrap {
          &.has-help {
            span {
              color: var(--light-text);

              a {
                color: var(--primary);
              }
            }
          }
        }
      }
    }
  }
  .remember-toggle {
    input {
      &:checked + .toggler {
        border-color: var(--primary);

        > span {
          background: var(--primary);
        }
      }
    }

    .toggler {
      border-color: var(--dark-sidebar-light-12);

      > span {
        background: var(--dark-sidebar-light-12);
      }
    }
  }
}

.login-button {
  background-color: rgb(75, 136, 75);
  color: var(--body-color);
  padding: 4px 10px;
  border-radius: 10px;
}
</style>
