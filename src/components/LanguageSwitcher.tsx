import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import cn from "classnames";
import { useTranslation, SUPPORTED_LOCALES, Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  uk: "UA",
};

const LanguageSwitcher = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-x-1 rounded-md px-2 py-1 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <span>{localeLabels[locale]}</span>
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cn("h-3 w-3 transition", { "rotate-180": open })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute right-0 top-full z-10 mt-2 w-40 rounded-md bg-movidark/95 py-2 shadow-lg ring-1 ring-white/10 focus:outline-none">
              {SUPPORTED_LOCALES.map((lng) => (
                <Menu.Item key={lng}>
                  {({ active }) => (
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: router.query,
                      }}
                      as={router.asPath}
                      locale={lng}
                    >
                      <a
                        className={cn(
                          "flex items-center justify-between px-4 py-2 text-sm",
                          {
                            "bg-white/10": active,
                            "font-bold text-moviyellow": lng === locale,
                            "text-white/80": lng !== locale,
                          }
                        )}
                      >
                        <span>{t(`languages.${lng}`)}</span>
                        <span className="text-xs opacity-60">
                          {localeLabels[lng]}
                        </span>
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default LanguageSwitcher;
